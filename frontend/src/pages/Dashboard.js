import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
const axios = require('axios');



const Dashboard = () => {
	const history = useHistory()
	const [bookdata, setBooksData] = useState([])
	const [loggedinuser, setUser] = useState({})

	async function populateBooksData() {
		const req = await fetch('/api/books', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})
		const temp = await req.json()
		//console.log("Books data", temp);
		setBooksData(temp)
	}

	useEffect(() => {
		populateBooksData()
		const token = localStorage.getItem('token')
		if (token) {
			const temploggedinuser = jwt.decode(token)
			if (!temploggedinuser) {
				localStorage.removeItem('token')
				history.replace('/login')
			} else {
				//console.log("TOKEN", jwt.decode(token));
				//console.log("LOGGED IN USR", temploggedinuser)
				populateBooksData()
				setUser(temploggedinuser)
			}
		}
	}, [])



	const removeBook = async (id) => {
		var booksbought = []
		booksbought = loggedinuser.booksbought
		booksbought.splice(booksbought, 1)
		const req = await axios.put(`/api/user/${loggedinuser.email}`,
			{
				booksbought: booksbought
			})
		const token = localStorage.getItem('token')
		if (token) {
			const temploggedinuser = jwt.decode(token)
			temploggedinuser.booksbought = booksbought

			localStorage.removeItem('token')
			const temptoken = jwt.sign(
				temploggedinuser,
				'secret123'
			)
			localStorage.setItem('token', temptoken)
			setUser(temploggedinuser)
		}
	}


	const addBook = async (id) => {
		var booksbought = []
		booksbought = loggedinuser.booksbought
		booksbought.push(id)
		const req = await axios.put(`/api/user/${loggedinuser.email}`,
			{
				booksbought: booksbought
			})

		//console.log("AFTER DATA", req);
		const token = localStorage.getItem('token')
		if (token) {
			const temploggedinuser = jwt.decode(token)
			temploggedinuser.booksbought = booksbought

			localStorage.removeItem('token')
			const temptoken = jwt.sign(
				temploggedinuser,
				'secret123'
			)
			localStorage.setItem('token', temptoken)
			setUser(temploggedinuser)
		}
	}


	return (
		<div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">

					<TableHead>
						<TableRow>
							<TableCell align="center">S.No</TableCell>
							<TableCell align="center">Ttile</TableCell>
							<TableCell align="center">Genre</TableCell>
							<TableCell align="center">Author</TableCell>
							<TableCell align="center">Price&nbsp;($)</TableCell>
							<TableCell align="center">Buy</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{bookdata.map((row, index) => {
							if (loggedinuser.booksbought.includes(row._id))
								return (
									<TableRow key={index}>
										<TableCell align="center">{index + 1}</TableCell>
										<TableCell align="center">{row.name}</TableCell>
										<TableCell align="center">{row.genre}</TableCell>
										<TableCell align="center">{row.author.name}</TableCell>
										<TableCell align="center">{row.price ?? 0}</TableCell>
										<TableCell align="center" ><Button onClick={() => removeBook(row._id)} variant="contained">Remove</Button></TableCell>

									</TableRow>
								)
							else {
								return (
									<TableRow key={index}>
										<TableCell align="center">{index + 1}</TableCell>
										<TableCell align="center">{row.name}</TableCell>
										<TableCell align="center">{row.genre}</TableCell>
										<TableCell align="center">{row.author.name}</TableCell>
										<TableCell align="center">{row.price ?? 0}</TableCell>
										<TableCell align="center" >< Button onClick={() => addBook(row._id)} variant="contained">Add</Button></TableCell>
									</TableRow>
								)
							}
						}

						)}
					</TableBody>

				</Table>
			</TableContainer>
		</div>
	)
}

export default Dashboard
