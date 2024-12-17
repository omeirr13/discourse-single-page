import React from 'react';

const reactions = [
  { emoji: '❤️', label: 'heart' },
  { emoji: '👍', label: '+1' },
  { emoji: '😆', label: 'laughing' },
  { emoji: '😮', label: 'open_mouth' },
  { emoji: '👏', label: 'clap' },
  { emoji: '🤗', label: 'hugs' },
  { emoji: '😘', label: 'kissing_heart' },
];

const ReactionsBar = () => {
  const handleReactionClick = (reaction) => {
    console.log('Selected reaction:', reaction);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="relative inline-block group">
      {/* Icon that triggers the reactions bar */}
      <div className="p-2 bg-gray-200 rounded-full cursor-pointer">
        <span role="img" aria-label="React">
          😊
        </span>
      </div>

      {/* Reactions bar */}
      <div className="hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 space-x-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg group-hover:flex">
        {reactions.map((reaction) => (
          <button
            key={reaction.label}
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={() => handleReactionClick(reaction)}
          >
            <span role="img" aria-label={reaction.label}>
              {reaction.emoji}
            </span>
          </button>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ReactionsBar;
