/* eslint-disable default-case */
import { useState } from "react";

import styled from "styled-components";

import {
	FormControl,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	Box,
} from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import Button from "@mui/material/Button";

import "./styles/allProjects.css";

const GOOD_TAGS = [
	"Amazing Lectures",
	"Inspirational",
	"Gives Good Feedback",
	"Caring",
	"Respected",
	"Accessible Outside Class",
	"Online Savvy",
	"Clear Grading Criteria",
	"Extra Credit",
	"Group Projects",
	"Hilarious",
];

const BAD_TAGS = [
	"Participation Matters",
	"Lots Of Homework",
	"Beware Of Pop Quizzes",
	"So Many Papers",
	"Lecture Heavy",
	"Test Heavy",
	"Graded By Few Things",
	"Tough Grader",
	"Get Ready To Read",
];

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30px;
	padding-top: 0px;
    margin-top: -50px;
	padding-bottom: 50px;
	background-color: #fafafa;
`;

const TagsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`;

const TagItem = styled.div`
	margin: 10px;
`;

export const CustomButton = muiStyled(Button)({
	backgroundColor: "#fdc700",
	borderRadius: "20px",
	color: "black",
	"&:hover": {
		backgroundColor: "#003c6c",
		color: "white",
	},
});

const CustomCheckbox = muiStyled(Checkbox)({
	color: "#003c6c",
	"&.Mui-checked": {
		color: "#003c6c",
	},
});

const Scheduler = ({ generate }) => {
	const [selectedTags, setSelectedTags] = useState([]);

	const handleTagChange = (event) => {
		const { value } = event.target;
		if (selectedTags.includes(value)) {
			setSelectedTags(selectedTags.filter((tag) => tag !== value));
		} else if (selectedTags.length < 5) {
			setSelectedTags([...selectedTags, value]);
		}
	};

	return (
		<Container>
			<FormControl variant="outlined" fullWidth>
				<div className="subtitle">
					Select your major (more coming soon)
				</div>
				<Select
					labelId="major-label"
					id="major"
					defaultValue="computer-science"
				>
					<MenuItem value="computer-science">
						Computer Science
					</MenuItem>
				</Select>
			</FormControl>
			<Box mt={3}>
				<p className="avoid-text">I want...</p>
				<TagsContainer>
					{GOOD_TAGS.map((tag, index) => (
						<TagItem key={index}>
							<FormControlLabel
								control={
									<CustomCheckbox
										id={`tag-${index}`}
										name="tags"
										value={tag}
										checked={selectedTags.includes(tag)}
										onChange={handleTagChange}
										disabled={
											!selectedTags.includes(tag) &&
											selectedTags.length >= 5
										}
									/>
								}
								label={tag}
							/>
						</TagItem>
					))}
				</TagsContainer>
			</Box>
			<Box mt={5}>
				<p className="avoid-text">Please Avoid...</p>
				<TagsContainer>
					{BAD_TAGS.map((tag, index) => (
						<TagItem key={index}>
							<FormControlLabel
								control={
									<CustomCheckbox
										id={`tag-${index}`}
										name="tags"
										value={tag}
										checked={selectedTags.includes(tag)}
										onChange={handleTagChange}
										disabled={
											!selectedTags.includes(tag) &&
											selectedTags.length >= 5
										}
									/>
								}
								label={tag}
							/>
						</TagItem>
					))}
				</TagsContainer>
			</Box>

			<Box
				mt={6}
				display="flex"
				justifyContent="center"
				alignItems="center"
			>
				<CustomButton
					variant="contained"
					type="submit"
					onClick={generate}
				>
					Submit
				</CustomButton>
			</Box>
		</Container>
	);
};

export default Scheduler;
