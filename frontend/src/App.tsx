import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, TextField, Button, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { Add as AddIcon, Check as CheckIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type GroceryItem = {
  id: bigint;
  name: string;
  emoji: string;
  completed: boolean;
  quantity: number;
};

type CategoryItem = {
  id: bigint;
  name: string;
  emoji: string;
};

type Category = {
  name: string;
  items: CategoryItem[];
};

const App: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const fetchCategories = async () => {
    try {
      const result = await backend.getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const onSubmit = async (data: { name: string; emoji: string; quantity: number }) => {
    setLoading(true);
    try {
      await backend.addItem(data.name, data.emoji, BigInt(data.quantity), []);
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

  const addItemFromCategory = async (item: CategoryItem, quantity: number) => {
    setLoading(true);
    try {
      await backend.addItem(item.name, item.emoji, BigInt(quantity), [item.id]);
      await fetchItems();
    } catch (error) {
      console.error('Error adding item from category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" alignItems="center" mb={2}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        <Typography variant="h4" component="h1">
          Grocery List
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Custom Item
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
              <Controller
                name="quantity"
                control={control}
                defaultValue={1}
                rules={{ required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    type="number"
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
          </Paper>
          {categories.map((category) => (
            <Paper key={category.name} elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              <List>
                {category.items.map((item) => (
                  <ListItem key={Number(item.id)} disablePadding>
                    <ListItemIcon>{item.emoji}</ListItemIcon>
                    <ListItemText primary={item.name} />
                    <ListItemSecondaryAction>
                      <Controller
                        name={`quantity-${item.id}`}
                        control={control}
                        defaultValue={1}
                        rules={{ min: 1 }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            variant="outlined"
                            size="small"
                            sx={{ width: 60, mr: 1 }}
                          />
                        )}
                      />
                      <IconButton
                        edge="end"
                        aria-label="add"
                        onClick={() => addItemFromCategory(item, field.value)}
                      >
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Grocery List
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
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
                    <ListItemText primary={`${item.name} (${item.quantity})`} />
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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
