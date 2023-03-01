import { useCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import React from "react";
import axios from "axios";

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </div>
//   )
// }

const title = "React";
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

//initialStories list
const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: "Java",
    url: "https://redux.js.org/",
    author: "LK BAL,Salom",
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
];

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    console.log("A");
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [iserror, setIsError] = useState(false);

  const storyReducer = (state, action) => {
    if (action.type === "Set_Stories") {
      return action.payload;
    } else if (action.type === "REMOVE_STORY") {
      return state.filter(
        (input) => action.payload.objectID !== input.objectID
      );
    } else {
      throw new Error();
    }
  };

  // const asyncStories = () =>
  //   new Promise((input) => setTimeout(() => input({ initialStories })), 1000);

  //PSUEDO PROMISE CREATED FOR UNDERSTANDING
  // React.useEffect(() => {
  //   setLoading(true);

  //   asyncStories()
  //     .then((result) => {
  //       setStories({
  //         type: "Set_Stories",
  //         payload: result.initialStories,
  //       });
  //       setLoading(false);
  //     })
  //     .catch(() => setIsError(true));
  // }, []);

  //FETCHING FROM API -HACKER NEWS API

  const [searchTerm, setSearchTerm] = useStorageState("search", "");

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handlefetchStories = useCallback(async () => {
    if (!searchTerm) return;
    setLoading(true);

    //   fetch(url)
    //     .then((res) =>
    //       // console.log(res);
    //       res.json()
    //     )
    //     .then((output) => {
    //       console.log(output);
    //       setStories({
    //         type: "Set_Stories",
    //         payload: output.hits,
    //       });
    //     });
    //   setLoading(false);
    // }, [url]);

    //   axios
    //     .get(url)
    //     .then(
    //       (res) => {
    //         console.log(res);
    //         setStories({
    //           type: "Set_Stories",
    //           payload: res.data.hits,
    //         });
    //       }
    //       // res.json()
    //     )
    //     .then((output) => {
    //       console.log("read" + output);
    //     });
    //   setLoading(false);
    // }, [url]);

    try {
      const res = await axios.get(url);

      setStories({
        type: "Set_Stories",
        payload: res.data.hits,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [url]);

  useEffect(() => {
    console.log("how do I log!");
    handlefetchStories();
  }, [handlefetchStories]);

  // const getAsyncStories = () =>
  //   new Promise((resolve) =>
  //     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  //   );

  // const [stories, setStories] = React.useState(initialStories);

  const [stories, setStories] = React.useReducer(storyReducer, []);

  const handleRemoveStory = (item) => {
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // );
    setStories({
      type: "REMOVE_STORY",
      payload: item,
    });

    // setStories(newStories);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) => {
    console.log(story.title + "test");
    if (story.title) {
      return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <form onSubmit={handleSearchSubmit}>
        <InputWithLabel
          id="search"
          value={searchTerm}
          isFocused
          onInputChange={handleSearch}
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!searchTerm}
          >
            Submit
          </button>
        </div>
      </form>

      <hr />

      {iserror && <p>Something Went Wrong!!!</p>}

      {loading ? (
        "Loading...."
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
