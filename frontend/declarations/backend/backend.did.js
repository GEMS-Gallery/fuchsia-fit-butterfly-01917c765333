export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const GroceryItem = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
    'emoji' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'getItems' : IDL.Func([], [IDL.Vec(GroceryItem)], ['query']),
    'toggleItemCompletion' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
