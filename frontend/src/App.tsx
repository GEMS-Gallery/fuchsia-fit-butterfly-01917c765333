import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, TextField, Button, Box, Grid, Paper, CircularProgress, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { Add as AddIcon, Check as CheckIcon, Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type GroceryItem = {
  id: bigint;
  name: string;
  emoji: string;
  completed: boolean;
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

const AddCustomItemForm: React.FC<{ onSubmit: (data: { name: string; emoji: string }) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
  const { control, handleSubmit, reset } = useForm();

  const handleFormSubmit = (data: { name: string; emoji: string }) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          />
        )}
      />
      <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
        Add Item
      </Button>
    </Box>
  );
};

const App: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const onSubmit = async (data: { name: string; emoji: string }) => {
    setLoading(true);
    try {
      await backend.addItem(data.name, data.emoji, []);
      await fetchItems();
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);
      setSnackbarMessage('Error adding item');
      setSnackbarOpen(true);
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

  const handleAddItemFromCategory = async (item: CategoryItem) => {
    setLoading(true);
    try {
      await backend.addItem(item.name, item.emoji, [item.id]);
      await fetchItems();
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item from category:', error);
      setSnackbarMessage('Error adding item');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.removeItem(id);
      await fetchItems();
      setSnackbarMessage('Item removed successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbarMessage('Error removing item');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Grocery List
          </Typography>
          <Button color="inherit" onClick={() => setOpenAddItemDialog(true)}>
            Add Custom Item
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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
                        <IconButton
                          edge="end"
                          aria-label="add"
                          onClick={() => handleAddItemFromCategory(item)}
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
                      <ListItemText primary={item.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="toggle"
                          onClick={() => toggleCompletion(item.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon />
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
      <Dialog open={openAddItemDialog} onClose={() => setOpenAddItemDialog(false)}>
        <DialogTitle>Add Custom Item</DialogTitle>
        <DialogContent>
          <AddCustomItemForm onSubmit={onSubmit} onClose={() => setOpenAddItemDialog(false)} />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default App;
