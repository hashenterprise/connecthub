import React from 'react';
import EmojiPicker from 'emoji-picker-react';

interface EmojiPickerProps {
  onEmojiClick: (event: any, emojiObject: any) => void;
}

const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({ onEmojiClick }) => {
  return <EmojiPicker onEmojiClick={onEmojiClick} />;
};

export default EmojiPickerComponent;