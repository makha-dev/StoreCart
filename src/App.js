import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let items = localStorage.getItem('items');
  if(items){
    return JSON.parse(localStorage.getItem('items'));
  }
  return [];
}

function App() {
  const [items, setItems] = useState(getLocalStorage);
  const [name, setName] = useState('');
  const [alert, setAlert] = useState({show: false, msg: '', type: ''});
  const [edit, setEdit] = useState(false);
  const [editID, setEditID] = useState(null);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let timer = setTimeout(() => {
      setAlert({show: false});
    }, 5000);
    return () => clearTimeout(timer);
  }, [alert]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name){
      setAlert({show: true, msg: 'Please enter the value', type: 'danger'});      
    }
    else if(edit){
      setItems(
        items.map((item) => {
          if(item.id === editID){
            return {...item, name: name};
          }
          return item;
        })
      );
      setName('');
      setEdit(false);
      setAlert({show: true, msg: 'Value was successfully changed', type: 'success'});
    }
    else{
      const newList = [...items, {id: new Date().getTime().toString(), name: name}];
      setItems(newList);
      setName('');
      setAlert({show: true, msg: 'Item was successfully added to the list', type: 'success'});
    }
  }

  const removeItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    setAlert({show: true, msg: 'Item was successfully deleted from the list', type: 'danger'});
  }

  const editItem = (id) => {
    setEdit(true);
    setEditID(id);
    const newName = (items.filter((item) => item.id === id))[0].name;
    setName(newName);
  }

  const clearItems = () => {
    setAlert({show: true, msg: 'The cart was cleared', type: 'danger'});
    setItems([]);
  }
  
  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert}></Alert>}
        <h3>Grocery Bud</h3>
        <div className='form-control'>
          <input 
          type="text" 
          className='grocery'
          placeholder='e.g. eggs'
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
          <button className='submit-btn' type='submit'>
            {edit ? 'Edit' : 'Submit'}
          </button>
        </div>
      </form>
      {items.length > 0 && 
      (
        <div className='grocery-container'>
          <List items={items} removeItem={removeItem} editItem={editItem}></List>
          <button className='clear-btn' onClick={clearItems}>clear Items</button>
        </div>
      )}
    </section>
  );
}

export default App;
