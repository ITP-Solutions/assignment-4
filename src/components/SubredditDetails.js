import React from "react";

export default function SubredditInfo({ details }) {
  return (
    <div>
      <h2>Info</h2>
      <p>Subreddit Title: {details.title}</p>
      <p>Description: {details.description}</p>
      <p>Display Name Prefixed: {details.name}</p>
      <p>Subscribers: {details.subscribers.toLocaleString()}</p>
    </div>
  );
}
