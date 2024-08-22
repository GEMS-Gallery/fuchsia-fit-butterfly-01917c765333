import Bool "mo:base/Bool";
import List "mo:base/List";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Hash "mo:base/Hash";

actor {
  type GroceryItem = {
    id: Nat;
    name: Text;
    emoji: Text;
    completed: Bool;
  };

  stable var nextId: Nat = 0;
  stable var needsInitialization : Bool = true;
  let groceryList = HashMap.HashMap<Nat, GroceryItem>(10, Nat.equal, Hash.hash);

  let commonItems = [
    { name = "Apple"; emoji = "🍎" },
    { name = "Banana"; emoji = "🍌" },
    { name = "Milk"; emoji = "🥛" },
    { name = "Bread"; emoji = "🍞" },
    { name = "Eggs"; emoji = "🥚" }
  ];

  public func addItem(name: Text, emoji: Text) : async Result.Result<Nat, Text> {
    let id = nextId;
    nextId += 1;
    let item: GroceryItem = {
      id = id;
      name = name;
      emoji = emoji;
      completed = false;
    };
    groceryList.put(id, item);
    #ok(id)
  };

  public func toggleItemCompletion(id: Nat) : async Result.Result<(), Text> {
    switch (groceryList.get(id)) {
      case (null) {
        #err("Item not found")
      };
      case (?item) {
        let updatedItem = {
          id = item.id;
          name = item.name;
          emoji = item.emoji;
          completed = not item.completed;
        };
        groceryList.put(id, updatedItem);
        #ok()
      };
    }
  };

  public func getItems() : async [GroceryItem] {
    if (needsInitialization) {
      await initializeGroceryList();
      needsInitialization := false;
    };
    Iter.toArray(Iter.map(groceryList.entries(), func (entry : (Nat, GroceryItem)) : GroceryItem { entry.1 }))
  };

  private func initializeGroceryList() : async () {
    if (groceryList.size() == 0) {
      for (item in commonItems.vals()) {
        ignore await addItem(item.name, item.emoji);
      };
    };
  };
}
