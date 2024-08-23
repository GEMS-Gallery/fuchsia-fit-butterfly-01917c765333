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
    quantity: Nat;
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
      name = "Fruits";
      items = [
        { id = 1; name = "Apple"; emoji = "🍎" },
        { id = 2; name = "Banana"; emoji = "🍌" },
        { id = 3; name = "Orange"; emoji = "🍊" },
        { id = 4; name = "Grapes"; emoji = "🍇" },
        { id = 5; name = "Strawberry"; emoji = "🍓" }
      ];
    },
    {
      name = "Vegetables";
      items = [
        { id = 6; name = "Carrot"; emoji = "🥕" },
        { id = 7; name = "Broccoli"; emoji = "🥦" },
        { id = 8; name = "Tomato"; emoji = "🍅" },
        { id = 9; name = "Cucumber"; emoji = "🥒" },
        { id = 10; name = "Lettuce"; emoji = "🥬" }
      ];
    },
    {
      name = "Dairy";
      items = [
        { id = 11; name = "Milk"; emoji = "🥛" },
        { id = 12; name = "Cheese"; emoji = "🧀" },
        { id = 13; name = "Yogurt"; emoji = "🥣" },
        { id = 14; name = "Butter"; emoji = "🧈" },
        { id = 15; name = "Eggs"; emoji = "🥚" }
      ];
    },
    {
      name = "Meat";
      items = [
        { id = 16; name = "Chicken"; emoji = "🍗" },
        { id = 17; name = "Beef"; emoji = "🥩" },
        { id = 18; name = "Fish"; emoji = "🐟" },
        { id = 19; name = "Pork"; emoji = "🥓" },
        { id = 20; name = "Turkey"; emoji = "🦃" }
      ];
    },
    {
      name = "Bakery";
      items = [
        { id = 21; name = "Bread"; emoji = "🍞" },
        { id = 22; name = "Croissant"; emoji = "🥐" },
        { id = 23; name = "Cake"; emoji = "🍰" },
        { id = 24; name = "Cookies"; emoji = "🍪" },
        { id = 25; name = "Bagel"; emoji = "🥯" }
      ];
    },
    {
      name = "Beverages";
      items = [
        { id = 26; name = "Water"; emoji = "💧" },
        { id = 27; name = "Soda"; emoji = "🥤" },
        { id = 28; name = "Coffee"; emoji = "☕" },
        { id = 29; name = "Tea"; emoji = "🍵" },
        { id = 30; name = "Juice"; emoji = "🧃" }
      ];
    },
    {
      name = "Snacks";
      items = [
        { id = 31; name = "Chips"; emoji = "🥔" },
        { id = 32; name = "Popcorn"; emoji = "🍿" },
        { id = 33; name = "Nuts"; emoji = "🥜" },
        { id = 34; name = "Chocolate"; emoji = "🍫" },
        { id = 35; name = "Candy"; emoji = "🍬" }
      ];
    },
    {
      name = "Cleaning Supplies";
      items = [
        { id = 36; name = "Paper Towels"; emoji = "🧻" },
        { id = 37; name = "Dish Soap"; emoji = "🧼" },
        { id = 38; name = "Trash Bags"; emoji = "🗑️" },
        { id = 39; name = "Laundry Detergent"; emoji = "🧺" },
        { id = 40; name = "All-Purpose Cleaner"; emoji = "🧽" }
      ];
    }
  ];

  public func addItem(name: Text, emoji: Text, quantity: Nat, id: ?Nat) : async Result.Result<Nat, Text> {
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
      quantity = quantity;
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
          quantity = item.quantity;
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
          ignore await addItem(item.name, item.emoji, 1, ?item.id);
        };
      };
    };
  };
}
