import Int "mo:core/Int";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

actor {
  // Types
  type Task = {
    id : Text;
    title : Text;
    state : TaskState;
    estimatedMinutes : Nat;
    skipCount : Nat;
    difficultyMultiplier : Float;
    createdAt : Int;
    subtasks : [Subtask];
  };

  type Subtask = {
    id : Text;
    title : Text;
    completed : Bool;
  };

  type TaskState = {
    #idle;
    #active;
    #completed;
    #avoided;
  };

  type Session = {
    id : Text;
    taskId : Text;
    startTime : Int;
    outcome : Outcome;
    minutesSpent : Nat;
  };

  type Outcome = {
    #completed;
    #avoided;
  };

  type Stats = {
    completedCount : Nat;
    avoidedCount : Nat;
    totalFocusMinutes : Nat;
    currentBurdenScore : Nat;
  };

  // Modules
  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Text.compare(task1.id, task2.id);
    };
  };

  // State
  let tasks = Map.empty<Text, Task>();
  let sessions = Map.empty<Text, Session>();
  var stats : Stats = {
    completedCount = 0;
    avoidedCount = 0;
    totalFocusMinutes = 0;
    currentBurdenScore = 0;
  };

  // Task Management
  public shared ({ caller }) func createTask(
    id : Text,
    title : Text,
    estimatedMinutes : Nat,
    subtasks : [Subtask],
  ) : async () {
    let task : Task = {
      id;
      title;
      state = #idle;
      estimatedMinutes;
      skipCount = 0;
      difficultyMultiplier = 1.0;
      createdAt = Time.now();
      subtasks;
    };
    tasks.add(id, task);
  };

  public query ({ caller }) func getTask(id : Text) : async Task {
    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };
  };

  public shared ({ caller }) func updateTask(id : Text, task : Task) : async () {
    if (not tasks.containsKey(id)) {
      Runtime.trap("Task not found");
    };
    tasks.add(id, task);
  };

  public shared ({ caller }) func deleteTask(id : Text) : async () {
    if (not tasks.containsKey(id)) {
      Runtime.trap("Task not found");
    };
    tasks.remove(id);
  };

  // Session Management
  public shared ({ caller }) func startSession(id : Text, taskId : Text) : async () {
    if (not tasks.containsKey(taskId)) {
      Runtime.trap("Task not found");
    };
    let session : Session = {
      id;
      taskId;
      startTime = Time.now();
      outcome = #avoided;
      minutesSpent = 0;
    };
    sessions.add(id, session);
  };

  public shared ({ caller }) func endSession(id : Text, outcome : Outcome, minutesSpent : Nat) : async () {
    switch (sessions.get(id)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let updatedSession = {
          session with
          outcome;
          minutesSpent;
        };
        sessions.add(id, updatedSession);
      };
    };
  };

  // Carry-over Function
  public shared ({ caller }) func carryOverTasks() : async () {
    for ((id, task) in tasks.entries()) {
      if (task.state == #avoided) {
        let updatedTask = {
          task with
          estimatedMinutes = task.estimatedMinutes * 3 / 2;
          difficultyMultiplier = task.difficultyMultiplier + 0.5;
          subtasks = task.subtasks.concat([{ id = "extra"; title = "Make up for lost time"; completed = false }]);
        };
        tasks.add(id, updatedTask);
      };
    };

    let avoidedCount = stats.avoidedCount.toFloat();
    let totalFocus = stats.totalFocusMinutes.toFloat();
    let numerator = (100.0 * avoidedCount) + (500.0 * avoidedCount);
    let divided = numerator / (totalFocus + 1.0);

    stats := {
      stats with currentBurdenScore = Int.abs(divided.toInt());
    };
  };

  // Coach Query
  public query ({ caller }) func coachQuery(message : Text) : async Text {
    let avoided = tasks.values().toArray().find(func(task) { task.state == #avoided });
    if (?avoided != null) {
      return "You have avoided tasks. Focus on one next action.";
    };

    if (stats.currentBurdenScore > 80) {
      return "High burden score. Take one step now.";
    };

    "Stay focused. Pick a task and start.";
  };

  // Get All Tasks
  public query ({ caller }) func getAllTasks() : async [Task] {
    tasks.values().toArray().sort();
  };

  // Get Stats
  public query ({ caller }) func getStats() : async Stats {
    stats;
  };
};
