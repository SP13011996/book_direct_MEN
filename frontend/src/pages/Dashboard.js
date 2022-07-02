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



const Dashboard = () => {
	const history = useHistory()
	const [bookdata, setBooksData] = useState([])

	async function populateBooksData() {
		const req = await fetch('http://localhost:3000/api/books', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})
		const temp = await req.json()
		console.log("Books data", temp);
		setBooksData(temp)
	}

	useEffect(() => {
		populateBooksData()
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/login')
			} else {
				populateBooksData()
			}
		}
	}, [])


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
						</TableRow>
					</TableHead>


					<TableBody>
						{bookdata.map((row, index) => (
							<TableRow key={index}>
								<TableCell align="center">{index + 1}</TableCell>
								<TableCell align="center">{row.name}</TableCell>
								<TableCell align="center">{row.genre}</TableCell>
								<TableCell align="center">{row.author.name}</TableCell>
							</TableRow>
						))}
					</TableBody>

				</Table>
			</TableContainer>
		</div>
	)
}

export default Dashboard
