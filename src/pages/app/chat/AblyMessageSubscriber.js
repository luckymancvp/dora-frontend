import { useEffect, useState, useCallback } from "react";
import { Realtime } from "ably";
import { useSelector } from "react-redux";

const AblyMessageSubscriber = ({ onNewMessage }) => {
  const { messages } = useSelector((state) => state.messages);
  const [ably] = useState(() => new Realtime({ key: process.env.REACT_APP_ABLY_API_KEY }));
  const [channel, setChannel] = useState(null);

  const handleMessage = useCallback(
    (message) => {
      const uint8Array = new Uint8Array(message.data);
      const textDecoder = new TextDecoder("utf-8");
      const jsonString = textDecoder.decode(uint8Array);
      const jsonData = JSON.parse(jsonString);
      onNewMessage({ messages, jsonData });
    },
    [messages, onNewMessage]
  );

  const subscribeToChannel = useCallback(() => {
    const newChannel = ably.channels.get("all");
    newChannel.subscribe("new-message-event", handleMessage);
    setChannel(newChannel);
  }, [ably, handleMessage]);

  const unsubscribeFromChannel = useCallback(() => {
    if (channel) {
      channel.unsubscribe("new-message-event", handleMessage);
    }
  }, [channel, handleMessage]);

  useEffect(() => {
    subscribeToChannel();
    return unsubscribeFromChannel;
  }, [subscribeToChannel, unsubscribeFromChannel]);

  return null;
};

export default AblyMessageSubscriber;
