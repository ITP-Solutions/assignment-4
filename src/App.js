import React, { useState } from "react";
import { fetchPosts, fetchInfo, parseSubredditId } from "./api/RedditClient";
import SubredditPosts from "./components/SubredditPosts";
import SubredditDetails from "./components/SubredditDetails";
import Loader from "./components/Loader";

export default function App() {
  const [posts, setPosts] = useState();
  const [details, setDetails] = useState();
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!input) {
      alert("Your search can't be empty!");
      return;
    }

    search(input).then(() => {
      addToHistory(input);
    });
  }

  function search(input) {
    setIsLoading(true);
    setPosts(null);
    setDetails(null);

    return fetchPosts(input)
      .then((posts) => {
        setPosts(posts);
        const subredditId = parseSubredditId(posts);
        return fetchInfo(subredditId);
      })
      .then((details) => {
        setDetails(details);
        setIsLoading(false);
      });
  }

  function handleInputChange(event) {
    setInput(event.target.value);
  }

  function addToHistory(subreddit) {
    setSearchHistory(searchHistory.concat(subreddit));
  }

  function applyPreviousSearch(subreddit) {
    setInput(subreddit);
    search(subreddit);
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-9">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter a subreddit"
                className="form-control"
                value={input}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>

          {isLoading && <Loader />}

          <div className="mt-3 mb-3">
            {details && <SubredditDetails details={details} />}
          </div>
          <div className="mt-3 mb-3">
            {posts && <SubredditPosts posts={posts} />}
          </div>
        </div>
        <div className="col-3">
          <h4>Search History</h4>
          <ul className="list-unstyled">
            {searchHistory.length ? (
              searchHistory.map((term, index) => {
                return (
                  <li key={index}>
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        applyPreviousSearch(term);
                      }}
                    >
                      {term}
                    </button>
                  </li>
                );
              })
            ) : (
              <li>No searches made</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
