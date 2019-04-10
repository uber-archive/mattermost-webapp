// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

export default class Confetti extends React.PureComponent {
    render() {
        const ConfettiElements = () => {
            const confettiArray = [];
            const width = document.getElementById('post-list').clientWidth - 50;
            const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            const colors = [
                '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
                '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
                '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
                '#FF5722',
            ];
            for (let i = 0; i < 200; i++) {
                const randomRotation = Math.floor(Math.random() * 360);
                const randomWidth = Math.floor(Math.random() * width);
                const randomHeight = Math.floor(Math.random() * height);

                const randomAnimationDelay = Math.floor(Math.random() * 13);
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                const confetti = (
                    <div
                        key={`c_${i}`}
                        className='confetti'
                        style={{
                            top: `${randomHeight}px`,
                            left: `${randomWidth}px`,
                            backgroundColor: randomColor,
                            transform: `skew(15deg) rotate(${randomRotation}deg)`,
                            animationDelay: `${randomAnimationDelay}s`,
                        }}
                    />
                );
                confettiArray.push(confetti);
            }
            return confettiArray;
        };

        return (
            <div className='confetti-wrapper'>
                <ConfettiElements/>
            </div>
        );
    }
}
