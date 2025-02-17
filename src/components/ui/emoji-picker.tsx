import React from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface EmojiPickerProps {
  onEmojiClick: (emojiData: EmojiClickData) => void;
  theme?: Theme;
  className?: string;
}

const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({ 
  onEmojiClick, 
  theme = 'light',
  className 
}) => {
  return (
    <div className={className}>
      <EmojiPicker 
        onEmojiClick={onEmojiClick}
        theme={theme as Theme}
        lazyLoadEmojis={true}
      />
    </div>
  );
};

export default React.memo(EmojiPickerComponent);