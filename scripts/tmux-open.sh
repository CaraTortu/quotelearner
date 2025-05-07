#!/bin/bash

# Start a new session named quotelearner and open neovim
tmux new -s quotelearner -d 
tmux rename-window -t quotelearner 'EDIT'
tmux send-keys -t quotelearner 'nvim .' C-m 

tmux new-window -t quotelearner
tmux rename-window -t quotelearner 'RUN'
tmux send-keys -t quotelearner 'bun run dev' C-m

tmux split-window -h -t quotelearner
tmux send-keys -t quotelearner 'bun run db:studio' C-m

tmux select-window -t quotelearner:1
tmux switch -t quotelearner

