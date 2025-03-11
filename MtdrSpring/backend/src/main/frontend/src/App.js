/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * This is the application main React component. We're using "function"
 * components in this application. No "class" components should be used for
 * consistency.
 * @author  jean.de.lavarene@oracle.com
 */
import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import API_LIST from './API';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TableBody, CircularProgress } from '@mui/material';
import Moment from 'react-moment';

/* In this application we're using Function Components with the State Hooks
 * to manage the states. See the doc: https://reactjs.org/docs/hooks-state.html
 * This App component represents the entire app. It renders a NewItem component
 * and two tables: one that lists the todo items that are to be done and another
 * one with the items that are already done.
 */
function App() {
  // isLoading is true while waiting for the backend to return the list
  // of items. We use this state to display a spinning circle:
  const [isLoading, setLoading] = useState(false);
  // Similar to isLoading, isInserting is true while waiting for the backend
  // to insert a new item:
  const [isInserting, setInserting] = useState(false);
  // The list of todo items is stored in this state. It includes the "done"
  // "not-done" items:
  const [items, setItems] = useState([]);
  // In case of an error during the API call:
  const [error, setError] = useState();
  //For the subtasks
  const [subTasks, setSubTasks] = useState({});
  //To Know if the subtasks are been show
  const [expandedTasks, setExpandedTasks] = useState({});

  function deleteItem(deleteId) {
    // console.log("deleteItem("+deleteId+")")
    fetch(API_LIST + "/" + deleteId, {
      method: 'DELETE',
    })
      .then(response => {
        // console.log("response=");
        // console.log(response);
        if (response.ok) {
          // console.log("deleteItem FETCH call is ok");
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(
        (result) => {
          const remainingItems = items.filter(item => item.id !== deleteId);
          setItems(remainingItems);
        },
        (error) => {
          setError(error);
        }
      );
  }
  function toggleDone(event, id, description, done) {
    event.preventDefault();
    if (!done || (subTasks[id] && subTasks[id].every(subTask => subTask.done))) {
      modifyItem(id, description, done).then(
        (result) => { reloadOneIteam(id); },
        (error) => { setError(error); }
      );
    } else {
      window.alert("Error: All subtasks must be completed before marking the main task as done.");
    }
  }
  
  function reloadOneIteam(id) {
    fetch(API_LIST + "/" + id)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(
        (result) => {
          const items2 = items.map(
            x => (x.id === id ? {
              ...x,
              'description': result.description,
              'done': result.done
            } : x));
          setItems(items2);
        },
        (error) => {
          setError(error);
        });
  }
  function modifyItem(id, description, done) {
    // console.log("deleteItem("+deleteId+")")
    var data = { "description": description, "done": done };
    return fetch(API_LIST + "/" + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        // console.log("response=");
        // console.log(response);
        if (response.ok) {
          // console.log("deleteItem FETCH call is ok");
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      });
  }

  //Function to load the subtaks for an specific task
  function loadSubTasks(taskId) {
    fetch(`/subtask/${taskId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong (loadSubTasks)...');
        }
      })
      .then(
        (result) => {
          setSubTasks(prevSubtasks => ({
            ...prevSubtasks,
            [taskId]: result
          }));
        },
        (error) => {
          setError(error);
        }
      );
  }

  //Function to toggle the subtaks
  function toggleSubtasksVisibility(taskId) {
    setExpandedTasks(prevExpandedTasks => ({
      ...prevExpandedTasks,
      [taskId]: !prevExpandedTasks[taskId]
    }));
  }



  /*
  To simulate slow network, call sleep before making API calls.
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  */


  useEffect(() => {
    setLoading(true);
    // sleep(5000).then(() => {
    fetch(API_LIST)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ... (USE EFFECT 1)');
        }
      })
      .then(
        (result) => {
          setLoading(false);
          setItems(result);
          result.forEach(item => {
            if (!item.done) {
              loadSubTasks(item.id);
            }
          });
        },
        (error) => {
          setLoading(false);
          setError(error);
        });

    //})
  },
    // https://en.reactjs.org/docs/faq-ajax.html
    [] // empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
  );
  function addItem(text) {
    console.log("addItem(" + text + ")")
    setInserting(true);
    var data = {};
    console.log(data);
    data.description = text;
    fetch(API_LIST, {
      method: 'POST',
      // We convert the React state to JSON and send it as the POST body
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then((response) => {
      // This API doens't return a JSON document
      console.log(response);
      console.log();
      console.log(response.headers.location);
      // return response.json();
      if (response.ok) {
        return response;
      } else {
        throw new Error('Something went wrong ...');
      }
    }).then(
      (result) => {
        var id = result.headers.get('location');
        var newItem = { "id": id, "description": text }
        setItems([newItem, ...items]);
        setInserting(false);
      },
      (error) => {
        setInserting(false);
        setError(error);
      }
    );
  }

  function toggleSubTaskDone(event, subTaskId) {
    const checked = event.target.checked;
    fetch(`/subtask/${subTaskId}/toggle`, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({done:checked})
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(
        (result) => {
          // Actualizar el estado de la subtarea en el estado local
          const taskId = result.parentTask.id;
          setSubTasks(prevSubTasks => ({
            ...prevSubTasks,
            [taskId]: prevSubTasks[taskId].map(subTask =>
              subTask.id === subTaskId ? result : subTask
            )
          }));
        },
        (error) => {
          setError(error);
        }
      );
  }

  return (
    <div className="App">
      <h1>MY TODO LIST</h1>
      <NewItem addItem={addItem} isInserting={isInserting} />
      {error &&
        <p>Error: {error.message}</p>
      }
      {isLoading &&
        <CircularProgress />
      }
      {!isLoading &&
        <div id="maincontent">
          <table id="itemlistNotDone" className="itemlist">
            <TableBody>
              {items.map(item => (
                !item.done && (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td className="description">{item.description}
                        <Button onClick={() => toggleSubtasksVisibility(item.id)}>
                          {expandedTasks[item.id] ? '▼' : '►'}
                        </Button>
                      </td>
                      <td className="date"><Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment></td>
                      <td>
                        <Button variant="contained" className="DoneButton" onClick={(event) => toggleDone(event, item.id, item.description, !item.done)} size="small">
                          Done
                        </Button>
                      </td>
                    </tr>

                    {expandedTasks[item.id] && subTasks[item.id] && subTasks[item.id].map(subTask => (
                      <tr key={subTask.id}>
                        <td className="subtask-description">
                          <input
                            type="checkbox"
                            checked={subTask.done}
                            onChange={(event) => toggleSubTaskDone(event, subTask.id)}
                          />
                          {subTask.description}
                        </td>
                        <td className="date"><Moment format="MMM Do hh:mm:ss">{subTask.creation_ts}</Moment></td>
                      </tr>
                    ))}

                  </React.Fragment>
                )
              ))}
            </TableBody>
          </table>
          <h2 id="donelist">
            Done items
          </h2>
          <table id="itemlistDone" className="itemlist">
            <TableBody>
              {items.map(item => (
                item.done && (

                  <tr key={item.id}>
                    <td className="description">{item.description}</td>
                    <td className="date"><Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment></td>
                    <td><Button variant="contained" className="DoneButton" onClick={(event) => toggleDone(event, item.id, item.description, !item.done)} size="small">
                      Undo
                    </Button></td>
                    <td><Button startIcon={<DeleteIcon />} variant="contained" className="DeleteButton" onClick={() => deleteItem(item.id)} size="small">
                      Delete
                    </Button></td>
                  </tr>
                )))}
            </TableBody>
          </table>
        </div>
      }

    </div>
  );
}
export default App;