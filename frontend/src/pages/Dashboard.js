import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

var booksdata1 = ''

async function getBooksData() {
	const req = await fetch('http://localhost:3000/api/books', {
		headers: {
			'x-access-token': localStorage.getItem('token'),
		},
	})
	booksdata1 = await req.json()
	console.log("Books data", booksdata1);
}


const Dashboard = () => {
	const history = useHistory()
	const [quote, setQuote] = useState('')
	const [tempQuote, setTempQuote] = useState('')
	var booksdata = ''

	getBooksData();



	async function populateQuote() {
		const req = await fetch('http://localhost:3000/api/books', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})
		booksdata = await req.json()
		console.log("Books data", booksdata);
		if (booksdata.status === 'ok') {
			setQuote(data.quote)
		} else {
			alert(booksdata)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				console.log("WORKING");
				localStorage.removeItem('token')
				history.replace('/login')
			} else {

				populateQuote()
			}
		}
	}, [])

	async function updateQuote(event) {
		event.preventDefault()

		const req = await fetch('http://localhost:3000/api/books', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				quote: tempQuote,
			}),
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setQuote(tempQuote)
			setTempQuote('')
		} else {
			alert("data.name")
		}
	}

	const useStyles = makeStyles({
		finalRow: {
			backgroundColor: "lightblue"
		}
	});

	function createData(number, item, qty, price) {
		return { number, item, qty, price };
	}

	const rows = [
		createData(1, "Apple", 5, 3),
		createData(2, "Orange", 2, 2),
		createData(3, "Grapes", 3, 1),
		createData(4, "Tomato", 2, 1.6),
		createData(5, "Mango", 1.5, 4)
	];

	const classes = useStyles();
	let totalCost = 0;

	// Finding the Total Cost
	rows.forEach((row) => (totalCost += row.price));

	console.log(booksdata1);
	return (
		<div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>S.No</TableCell>
							<TableCell align="right">Ttile</TableCell>
							<TableCell align="right">Genre&nbsp;(kg)</TableCell>
							<TableCell align="right">Author&nbsp;($)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.number}>
								<TableCell component="th" scope="row">
									{row.number}
								</TableCell>
								<TableCell align="right">{row.number}</TableCell>
								<TableCell align="right">{row.item}</TableCell>
								<TableCell align="right">{row.quantity}</TableCell>
							</TableRow>
						))}
						<TableRow className={classes.finalRow}>
							<TableCell align="right" colSpan={4}>
								<b>Total Cost:</b> ${totalCost}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>


		</div>
	)
}

export default Dashboard
