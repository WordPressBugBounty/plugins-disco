import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	showEditor: false,
	componentToEdit: '',
	saveStatus: 'saved',
};

export const interactionSlice = createSlice({
	name: 'interaction',
	initialState,
	reducers: {
		setShowEditor: (state, action) => {
			state.showEditor = action.payload;
		},
		setComponentToEdit: (state, action) => {
			state.componentToEdit = action.payload;
		},
		setSaveStatus: (state, action) => {
			state.saveStatus = action.payload;
		},
	},
});

export const { setShowEditor, setComponentToEdit, setSaveStatus } =
	interactionSlice.actions;
export default interactionSlice.reducer;
