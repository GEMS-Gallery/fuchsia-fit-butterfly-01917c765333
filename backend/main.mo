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

  type CategoryItem = {
    id: Nat;
    name: Text;
    emoji: Text;
  };

  type Category = {
    name: Text;
    items: [CategoryItem];
  };

  stable var nextId: Nat = 0;
  stable var needsInitialization : Bool = true;
  let groceryList = HashMap.HashMap<Nat, GroceryItem>(10, Nat.equal, Hash.hash);

  let categories : [Category] = [
    {
      name = "Supplies";
      items = [
        { id = 1; name = "Paper Towels"; emoji = "🧻" },
        { id = 2; name = "Dish Soap"; emoji = "🧼" },
        { id = 3; name = "Trash Bags"; emoji = "🗑️" },
        { id = 4; name = "Aluminum Foil"; emoji = "🔲" },
        { id = 5; name = "Plastic Wrap"; emoji = "🎞️" }
      ];
    }
  ];

  public func addItem(name: Text, emoji: Text, id: ?Nat) : async Result.Result<Nat, Text> {
    let itemId = switch (id) {
      case (null) { nextId };
      case (?existingId) { existingId };
    };
    nextId += 1;
    let item: GroceryItem = {
      id = itemId;
      name = name;
      emoji = emoji;
      completed = false;
    };
    groceryList.put(itemId, item);
    #ok(itemId)
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

  public query func getItems() : async [GroceryItem] {
    Iter.toArray(Iter.map(groceryList.entries(), func (entry : (Nat, GroceryItem)) : GroceryItem { entry.1 }))
  };

  public query func getCategories() : async [Category] {
    categories
  };

  private func initializeGroceryList() : async () {
    if (groceryList.size() == 0) {
      for (category in categories.vals()) {
        for (item in category.items.vals()) {
          ignore await addItem(item.name, item.emoji, ?item.id);
        };
      };
    };
  };
}
