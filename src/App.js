import React from 'react';
import './App.css';

import { fetchPosts, fetchInfo, parseSubredditId } from './api/RedditClient';
import SubredditPosts from './components/SubredditPosts.jsx';
import SubredditInfo from './components/SubredditInfo.jsx';
import Loader from './components/Loader.jsx';

function App() {

  // Holds the data from api responses
  const [data, setData] = React.useState({
    posts: null,
    info: null
  });

  // Holds history state
  const [history, setHistory] = React.useState([]);

  // Whether or not error message should be displayed
  const [showError, setShowError] = React.useState(false);

  // Whether or not page is loading
  const [loading, setLoading] = React.useState(false);

  // Last user submission
  const [input, setInput] = React.useState('');

  // Bind the `handleSubmit` function to changes in the
  // input state
  React.useEffect(handleSubmit, [loading]);

  /**
   * Handles api calls/side effects from user submitting
   * form
   */
  function handleSubmit() {
    if (showError) setShowError(false);
    if (input === '') return;
    setData({
      posts: null,
      info: null
    });
    let posts;
    fetchPosts(encodeURIComponent(input))
      .then(res => {
        posts = res;
        return parseSubredditId(res);
      })
      .then(id => fetchInfo(id))
      .then(info => {
        setData({
          posts,
          info
        })
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        setShowError(true);
      })
      .finally(() => {
        addToHistory(input);
      });
  }

  /**
   * Submit callback for form
   *
   * @param e - event object from action
   */
  function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
  }

  /**
   * Given an input change, update the `input` state
   *
   * @param e - event target object
   */
  function onInputChange(e) {
    e.preventDefault();
    setInput(e.target.value);
  }

  /**
   * Adds subreddit input to history
   * 
   * @param subreddit - subreddit to add to history
   */
  function addToHistory(subreddit) {
    setHistory([
      ...history,
      subreddit
    ]);
  }

  /**
   * Wrapper function that manages history changes
   * @param subreddit - subreddit to change input to
   * @return function to be triggered by button event
   */
  function onHistoryChange(subreddit) {
    return function(e) {
      e.preventDefault();
      setInput(subreddit);
      setLoading(true);
    }
  }

  return (
    <div className="App row bg-secondary text-light p-2">
      <div className="col-9">
        <form onSubmit={onSubmit}>
          <p>Enter a subreddit:</p>
          <input type="text" id="subreddit-input" className="text-dark" value={input} onChange={onInputChange}/>
          <button type="submit"> Submit</button>
        </form>
        {data.info && <SubredditInfo info={data.info}/>}
        <br/><br/>
        {data.posts && <SubredditPosts posts={data.posts}/>}
        {showError && <p>Error loading that subreddit</p>}
        <Loader active={loading}/> 
      </div>
      <div className="col-3">
         {history.map(h => (
           <button type="button" className="button" onClick={onHistoryChange(h)}>
             {h}
           </button>
         ))}
      </div>
    </div>
  );
}

export default App;
