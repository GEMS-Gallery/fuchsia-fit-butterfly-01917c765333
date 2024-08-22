import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, TextField, Button, Box } from '@mui/material';
import { Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type GroceryItem = {
  id: bigint;
  name: string;
  emoji: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm();

  const fetchItems = async () => {
    try {
      const result = await backend.getItems();
      setItems(result);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onSubmit = async (data: { name: string; emoji: string }) => {
    setLoading(true);
    try {
      await backend.addItem(data.name, data.emoji);
      reset();
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.toggleItemCompletion(id);
      await fetchItems();
    } catch (error) {
      console.error('Error toggling item completion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Grocery List
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 2 }}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: 'Item name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Item Name"
              variant="outlined"
              fullWidth
              error={!!error}
              helperText={error?.message}
              sx={{ mb: 1 }}
            />
          )}
        />
        <Controller
          name="emoji"
          control={control}
          defaultValue=""
          rules={{ required: 'Emoji is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Emoji"
              variant="outlined"
              fullWidth
              error={!!error}
              helperText={error?.message}
              sx={{ mb: 1 }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
        >
          Add Item
        </Button>
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <List>
          {items.map((item) => (
            <ListItem
              key={Number(item.id)}
              disablePadding
              sx={{
                textDecoration: item.completed ? 'line-through' : 'none',
                opacity: item.completed ? 0.5 : 1,
              }}
            >
              <ListItemIcon>{item.emoji}</ListItemIcon>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="toggle"
                  onClick={() => toggleCompletion(item.id)}
                >
                  <CheckIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default App;
