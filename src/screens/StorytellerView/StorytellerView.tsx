import * as React from 'react';
import { tokenStore } from 'services/TokenStore';

interface IStorytellerProps {
    url: string;
}

export const StorytellerView: React.FC<IStorytellerProps> = ({ url }) => 
    <iframe src={`${url}?token=${tokenStore.getToken()}`} title="storyteller" width="100%" height="100%" frameBorder="0" />
