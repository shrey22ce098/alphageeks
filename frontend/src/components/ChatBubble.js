import React from "react";
import { Card } from "react-bootstrap";

function ChatBubble({ message, type }) {
  return (
    <Card className={`p-2 my-2 ${type === "sent" ? "text-end bg-light" : "text-start bg-primary text-white"}`}>
      {message}
    </Card>
  );
}

export default ChatBubble;
