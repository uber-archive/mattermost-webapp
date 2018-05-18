// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {createSelector} from 'reselect';
import {getSortedFeedChannelIds} from 'mattermost-redux/selectors/entities/channels';
import {getPost, getPostIdsInChannel} from 'mattermost-redux/selectors/entities/posts';

export const getEditingPost = createSelector(
    (state) => {
        if (state.views.posts.editingPost && state.views.posts.editingPost.postId) {
            return getPost(state, state.views.posts.editingPost.postId);
        }

        return null;
    },
    (state) => state.views.posts.editingPost,
    (post, editingPost) => {
        return {
            ...editingPost,
            post,
        };
    }
);

// Get the feed channel ids
// Select posts for those channels
// most recent 30 posts
export const getRecentFeedPosts = createSelector(
    getSortedFeedChannelIds,
    state => state,
    (feedIds, state) => {
        let feedPosts = [];
        feedIds.forEach(f => {
            const posts = getPostIdsInChannel(state, f);
            feedPosts = [...feedPosts, ...posts];
        });

        feedPosts = feedPosts.map(p => getPost(state, p)).filter(p => {
            return !p.type;
        }).sort((a, b) => {
            const date1 = new Date(a.create_at).getTime();
            const date2 = new Date(b.create_at).getTime();

            if (date1 < date2) {
                return 1;
            } else if (date1 > date2) {
                return -1;
            }

            return 0;
        });

        return feedPosts;
    }
);