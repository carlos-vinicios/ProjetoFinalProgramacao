import React, { useEffect, useState } from "react";
import {
    Chip,
      FormControl,
      Input
} from "@mui/material";
import { styled } from '@mui/system';

// import { makeStyles } from '@mui/material/styles';

// const useStyles = makeStyles((theme) => ({
// 	formControlRoot: {
// 		display: "flex",
// 		alignItems: "center",
// 		gap: "8px",
// 		width: "98%",
// 		flexWrap: "wrap",
// 		flexDirection: "row",
// 		border:'2px solid lightgray',
// 		padding:4,
// 		borderRadius:'4px',
// 		"&> div.container": {
// 			gap: "6px",
// 			display: "flex",
// 			flexDirection: "row",
// 			flexWrap: "wrap"
// 		},
// 		"& > div.container > span": {
// 			backgroundColor: "gray",
// 			padding: "1px 3px",
// 			borderRadius: "4px"
// 		}
// 	}
// }));

const StyledFormControl = styled(FormControl)({
	display: "flex",
	alignItems: "center",
	gap: "8px",
	width: "98%",
	flexWrap: "wrap",
	flexDirection: "row",
	border:'2px solid lightgray',
	padding:4,
	borderRadius:'4px',
	"&> div.container": {
		gap: "6px",
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap"
	},
	"& > div.container > span": {
		backgroundColor: "gray",
		padding: "1px 3px",
		borderRadius: "4px"
	}
});

export function MultiValueTextField({value, changeCallback}) {
	// const classes = useStyles();
	const [values, setValues] = useState(value);
	const [currValue, setCurrValue] = useState("");

    useEffect(() => {
        changeCallback(values)
    }, [values])

	const handleKeyUp = (e) => {
		if (e.keyCode === 32) {
			setValues((oldState) => [...oldState, e.target.value]);
			setCurrValue("");
		}
	};

	const handleChange = (e) => {
		setCurrValue(e.target.value);
    };
  
    const handleDelete = ( item, index) =>{
        let arr = [...values]
        arr.splice(index,1)
        setValues(arr)
    }

	return (
        <StyledFormControl>
            <div className={"container"}>
                {values.map((item,index) => (
                    <Chip  size="small" onDelete={()=>handleDelete(item,index)} label={item}/>
                ))}
            </div>
            <Input
                value={currValue}
                onChange={handleChange}
                onKeyDown={handleKeyUp}
            />
        </StyledFormControl>
	);
}