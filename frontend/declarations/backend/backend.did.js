export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const CategoryItem = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'emoji' : IDL.Text,
  });
  const Category = IDL.Record({
    'name' : IDL.Text,
    'items' : IDL.Vec(CategoryItem),
  });
  const GroceryItem = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
    'emoji' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addItem' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Nat)],
        [Result_1],
        [],
      ),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getItems' : IDL.Func([], [IDL.Vec(GroceryItem)], ['query']),
    'removeItem' : IDL.Func([IDL.Nat], [Result], []),
    'toggleItemCompletion' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
