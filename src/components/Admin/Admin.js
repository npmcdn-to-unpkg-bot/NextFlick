import React, {Component} from 'react'
import UploadFile from 'components/Utils/UploadFile'
import Select from 'react-select'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Modal, Button, Alert, Tabs, Tab} from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import 'react-bootstrap-table/css/react-bootstrap-table-all.min.css'
import $ from 'jquery'
import _ from 'lodash'
import classes from './Admin.scss'
import Loader from './Assets/ajax-loader.gif'

const {Header: ModalHeader, Title: ModalTitle, Body: ModalBody, Footer: ModalFooter} = Modal
export default class Admin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      Movies: [],
      Movie: '',
      Year: '',
      Location: '',
      Genre: [{
        value: 'one', label: 'one'
      }, {
        value: 'two', label: 'two'
      }],
      Actors: [{
        value: 'one', label: 'one'
      }, {
        value: 'two', label: 'two'
      }],
      Directors: [{
        value: 'one', label: 'one'
      }, {
        value: 'two', label: 'two'
      }],
      SimilarActors: [{
        value: 'one', label: 'one'
      }, {
        value: 'two', label: 'two'
      }],
      SimilarDirectors: [{
        value: 'one', label: 'one'
      }, {
        value: 'two', label: 'two'
      }],
      Conflicts: [{
        value: 'one', label: 'one'
      }, {
        value: 'two', label: 'two'
      }],
      Affiliations: [{
        value: 'one', label: 'one'
      }, {
        value: 'two', label: 'two'
      }],
      Locations: [],
      products: [],
      SelectedGenres: [],
      selectedRow: {
        _id: '',
        Movie: '',
        Year: '',
        Genre: [],
        Director: [],
        Actor: [],
        SimilarDirector: [],
        SimilarActor: [],
        Indie: '',
        Location: '',
        StrongFemaleLead: '',
        Awards: '',
        CentralConflict: [],
        Affiliation: []
      },
      addlSelectedRow: {
        _id: '',
        addActors: [],
        AddDirector: '',
        addPlot: '',
        addPoster: '',
        addTomatoMeter: '',
        addTomatoRating: '',
        addTomatoUserMeter: ''
      },
      alertMsj: 'Everything is up to date.',
      showAlert: true,
      alertType: 'info',
      showModal: false,
      isIndie: true,
      hasAwards: true,
      hasFemaleLead: true,
      displayLoader: 'none',
      displayAddlLoader: 'none'
    }

    this.onMovieChange = this.onMovieChange.bind(this)
    this.onYearChange = this.onYearChange.bind(this)
    this.onGenreChange = this.onGenreChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this.updateMovie = this.updateMovie.bind(this)
    this.editMovie = this.editMovie.bind(this)
    this.deleteMovie = this.deleteMovie.bind(this)
    this.getAddlData = this.getAddlData.bind(this)
    this.getMovieData = this.getMovieData.bind(this)
    this.handleIndieClick = this.handleIndieClick.bind(this)
    this.handleAwardsClick = this.handleAwardsClick.bind(this)
    this.handleFemaleClick = this.handleFemaleClick.bind(this)
    this.updateIndieClick = this.updateIndieClick.bind(this)
    this.updateAwardsClick = this.updateAwardsClick.bind(this)
    this.updateFemaleClick = this.updateFemaleClick.bind(this)
    this.uploadMovie = this.uploadMovie.bind(this)
    this.getUploadMovieData = this.getUploadMovieData.bind(this)
    this.onMovieNameChange = this.onMovieNameChange.bind(this)
    this.onYearValChange = this.onYearValChange.bind(this)
    this.onAddlRowSelect = this.onAddlRowSelect.bind(this)
    this.onAfterAddlCellEdit = this.onAfterAddlCellEdit.bind(this)
    this.csvToJson = this.csvToJson.bind(this)
    this.uploadMovies = this.props.uploadMovies
  }

  componentDidMount () {
    this.getMovieData()
  }
  onMovieNameChange (e) {
    const selRow = this.state.selectedRow
    selRow.Movie = e.target.value
    this.setState({selectedRow: selRow})
  }
  onYearValChange (e) {
    const selRow = this.state.selectedRow
    selRow.Year = e.target.value
    this.setState({selectedRow: selRow})
  }
  getAddlData () {
    this.setState({displayAddlLoader: 'initial'})
    this.props.getAdditionalData().then(this.getMovieData())
  }
  getMovieData () {
    this.props.getData().then((res) => { this.setState({Movies: res.movies.data, displayLoader: 'none', displayAddlLoader: 'none'}) })
    this.props.getActors().then((res) => {
      const act = res.actors.data.map(function (elem) { return { value: elem.name, label: elem.name} })
      this.setState({Actors: act})
    })
    this.props.getDirectors().then((res) => {
      const dir = res.directors.data.map(function (elem) { return { value: elem.name, label: elem.name} })
      this.setState({Directors: dir})
    })
    this.props.getGenres().then((res) => {
      const gen = res.genres.data.map(function (elem) { return { value: elem.name, label: elem.name} })
      this.setState({Genre: gen})
    })
    this.props.getConflicts().then((res) => {
      const gen = res.conflicts.data.map(function (elem) { return { value: elem.name, label: elem.name} })
      this.setState({Conflicts: gen})
    })
    this.props.getAffiliations().then((res) => {
      const gen = res.affiliations.data.map(function (elem) { return { value: elem.name, label: elem.name} })
      this.setState({Affiliations: gen})
    })
    this.props.getLocations().then((res) => {
      const gen = res.locations.data.map(function (elem) { return { value: elem.name, label: elem.name} })
      this.setState({Locations: gen})
    })
  }
  onMovieChange (e) {
    this.setState({Movie: e.target.value})
  }
  onYearChange (e) {
    this.setState({Year: e.target.value})
  }
  onGenreChange (e) {
    console.log(e)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.getData()
    var serializeData = $('form').serializeArray()
    let strongFemaleLead = ''
    if (serializeData.filter(x => x.name === 'form-female-lead').length === 1) {
      if (serializeData.filter(x => x.name === 'form-female-lead')[0].value === 'on') {
        strongFemaleLead = 'Yes'
      }
    }
    let indie = ''
    if (serializeData.filter(x => x.name === 'form-indie').length === 1) {
      if (serializeData.filter(x => x.name === 'form-indie')[0].value === 'on') {
        indie = 'Yes'
      }
    }
    let awards = ''
    if (serializeData.filter(x => x.name === 'form-awards').length === 1) {
      if (serializeData.filter(x => x.name === 'form-awards')[0].value === 'on') {
        awards = 'Yes'
      }
    }
    let newMovie = {
      Movie: serializeData.filter(x => x.name === 'form-movie-name').length === 1 ? serializeData.filter(x => x.name === 'form-movie-name')[0].value : '',
      Year: serializeData.filter(x => x.name === 'form-year').length === 1 ? serializeData.filter(x => x.name === 'form-year')[0].value : '',
      Genre: serializeData.filter(x => x.name === 'form-genres').length === 1 && serializeData.filter(x => x.name === 'form-genres')[0].value !== '' ? serializeData.filter(x => x.name === 'form-genres')[0].value.split(',').map(x => x.trim()) : [],
      Director: serializeData.filter(x => x.name === 'form-directors').length === 1 && serializeData.filter(x => x.name === 'form-directors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-directors')[0].value.split(',').map(x => x.trim()) : [],
      Actor: serializeData.filter(x => x.name === 'form-actors').length === 1 && serializeData.filter(x => x.name === 'form-actors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-actors')[0].value.split(',').map(x => x.trim()) : [],
      SimilarDirector: serializeData.filter(x => x.name === 'form-sim-directors').length === 1 && serializeData.filter(x => x.name === 'form-sim-directors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-sim-directors')[0].value.split(',').map(x => x.trim()) : [],
      SimilarActor: serializeData.filter(x => x.name === 'form-sim-actors').length === 1 && serializeData.filter(x => x.name === 'form-sim-actors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-sim-actors')[0].value.split(',').map(x => x.trim()) : [],
      Indie: indie,
      Location: serializeData.filter(x => x.name === 'form-location').length === 1 ? serializeData.filter(x => x.name === 'form-location')[0].value : '',
      StrongFemaleLead: strongFemaleLead,
      Awards: awards,
      CentralConflict: serializeData.filter(x => x.name === 'form-conflicts').length === 1 && serializeData.filter(x => x.name === 'form-conflicts')[0].value !== '' ? serializeData.filter(x => x.name === 'form-conflicts')[0].value.split(',').map(x => x.trim()) : [],
      Affiliation: serializeData.filter(x => x.name === 'form-affiliations').length === 1 && serializeData.filter(x => x.name === 'form-affiliations')[0].value !== '' ? serializeData.filter(x => x.name === 'form-affiliations')[0].value.split(',').map(x => x.trim()) : []
    }
    const movieObj = []
    movieObj.push(newMovie)
    Promise.resolve(this.props.saveMovie(movieObj)).then(this.getMovieData())
    this.setState({alertMsj: newMovie.Movie + ' was added!', Movie: '', Year: '', alertType: 'info'})
  }
  onRowSelect (row, isSelected) {
    if (isSelected) {
      this.setState({ selectedRow: row })
      this.updateIndieClick(row)
      this.updateAwardsClick(row)
      this.updateFemaleClick(row)
    } else {
      const selectedRow = {
        _id: '',
        Movie: '',
        Year: '',
        Genre: [],
        Director: [],
        Actor: [],
        SimilarDirector: [],
        SimilarActor: [],
        Indie: '',
        Location: '',
        StrongFemaleLead: '',
        Awards: '',
        CentralConflict: [],
        Affiliation: []
      }
      this.setState({ selectedRow: selectedRow })
    }
  }
  onAfterAddlCellEdit (row, cellName, cellValue) {
    row.addActors = row.Actor.join(', ')
    row.addDirector = row.Director.join(', ')
    console.log("Save cell '" + cellName + "' with value '" + cellValue + "'")
    console.log('Thw whole row :')
    console.log(row)
    const movieObj = [row]
    this.props.editMovie(movieObj)
  }
  onAddlRowSelect (row, isSelected) {
    if (isSelected) {
      this.setState({ addlSelectedRow: row })
      this.updateIndieClick(row)
      this.updateAwardsClick(row)
      this.updateFemaleClick(row)
    } else {
      const addlSelectedRow = {
        _id: '',
        addActors: [],
        AddDirector: '',
        addPlot: '',
        addPoster: '',
        addTomatoMeter: '',
        addTomatoRating: '',
        addTomatoUserMeter: ''
      }
      this.setState({ addlSelectedRow: addlSelectedRow })
    }
  }

  updateMovie () {
    var serializeData = $('#edit-movie-form').serializeArray()
    let strongFemaleLead = ''
    if (serializeData.filter(x => x.name === 'form-female-lead').length === 1) {
      if (serializeData.filter(x => x.name === 'form-female-lead')[0].value === 'on') {
        strongFemaleLead = 'Yes'
      }
    }
    let indie = ''
    if (serializeData.filter(x => x.name === 'form-indie').length === 1) {
      if (serializeData.filter(x => x.name === 'form-indie')[0].value === 'on') {
        indie = 'Yes'
      }
    }
    let awards = ''
    if (serializeData.filter(x => x.name === 'form-awards').length === 1) {
      if (serializeData.filter(x => x.name === 'form-awards')[0].value === 'on') {
        awards = 'Yes'
      }
    }
    let newMovie = {
      Movie: serializeData.filter(x => x.name === 'form-movie-name').length === 1 ? serializeData.filter(x => x.name === 'form-movie-name')[0].value : '',
      Year: serializeData.filter(x => x.name === 'form-year').length === 1 ? serializeData.filter(x => x.name === 'form-year')[0].value : '',
      Genre: serializeData.filter(x => x.name === 'form-genres').length === 1 && serializeData.filter(x => x.name === 'form-genres')[0].value !== '' ? serializeData.filter(x => x.name === 'form-genres')[0].value.split(',').map(x => x.trim()) : [],
      Director: serializeData.filter(x => x.name === 'form-directors').length === 1 && serializeData.filter(x => x.name === 'form-directors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-directors')[0].value.split(',').map(x => x.trim()) : [],
      Actor: serializeData.filter(x => x.name === 'form-actors').length === 1 && serializeData.filter(x => x.name === 'form-actors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-actors')[0].value.split(',').map(x => x.trim()) : [],
      SimilarDirector: serializeData.filter(x => x.name === 'form-sim-directors').length === 1 && serializeData.filter(x => x.name === 'form-sim-directors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-sim-directors')[0].value.split(',').map(x => x.trim()) : [],
      SimilarActor: serializeData.filter(x => x.name === 'form-sim-actors').length === 1 && serializeData.filter(x => x.name === 'form-sim-actors')[0].value !== '' ? serializeData.filter(x => x.name === 'form-sim-actors')[0].value.split(',').map(x => x.trim()) : [],
      Indie: indie,
      Location: serializeData.filter(x => x.name === 'form-location').length === 1 ? serializeData.filter(x => x.name === 'form-location')[0].value : '',
      StrongFemaleLead: strongFemaleLead,
      Awards: awards,
      CentralConflict: serializeData.filter(x => x.name === 'form-conflicts').length === 1 && serializeData.filter(x => x.name === 'form-conflicts')[0].value !== '' ? serializeData.filter(x => x.name === 'form-conflicts')[0].value.split(',').map(x => x.trim()) : [],
      Affiliation: serializeData.filter(x => x.name === 'form-affiliations').length === 1 && serializeData.filter(x => x.name === 'form-affiliations')[0].value !== '' ? serializeData.filter(x => x.name === 'form-affiliations')[0].value.split(',').map(x => x.trim()) : []
    }
    const movieObj = []
    movieObj.push(newMovie)
    Promise.resolve(this.props.editMovie(movieObj)).then(this.getMovieData())
    const id = this.state.selectedRow._id
    movieObj[0]._id = id
    this.setState({ showModal: false, alertType: 'info', selectedRow: movieObj[0], alertMsj: this.state.selectedRow.Movie + ' was updated!' })
  }
  close () {
    this.setState({ showModal: false })
  }
  open () {
    this.setState({ showModal: true })
  }

  handleIndieClick (e) {
    this.setState({isIndie: e.target.checked})
  }
  handleAwardsClick (e) {
    this.setState({hasAwards: e.target.checked})
  }
  handleFemaleClick (e) {
    this.setState({hasFemaleLead: e.target.checked})
  }

  updateIndieClick (row) {
    if (row.Indie === '') {
      this.setState({isIndie: false})
    } else {
      this.setState({isIndie: true})
    }
  }
  updateAwardsClick (row) {
    if (row.Awards === '') {
      this.setState({hasAwards: false})
    } else {
      this.setState({hasAwards: true})
    }
  }
  updateFemaleClick (row) {
    if (row.StrongFemaleLead === '') {
      this.setState({hasFemaleLead: false})
    } else {
      this.setState({hasFemaleLead: true})
    }
  }

  editMovie () {
    if (this.state.selectedRow._id === '') {
      this.setState({alertMsj: 'Select a movie before editing', alertType: 'danger'})
      return
    }
    this.setState({ showModal: true })
    console.log(this.state.selectedRow)
  }

  deleteMovie () {
    if (this.state.selectedRow._id === '') {
      this.setState({alertMsj: 'Select a movie before deleting', alertType: 'danger'})
      return
    }
    console.log(this.state.selectedRow._id)
    const body = {
      id: this.state.selectedRow._id
    }
    Promise.resolve(this.props.deleteMovie(body)).then(this.getMovieData())
    const movieName = this.state.selectedRow.Movie
    const selectedRow = {
      _id: '',
      Movie: '',
      Year: '',
      Genre: [],
      Director: [],
      Actor: [],
      SimilarDirector: [],
      SimilarActor: [],
      Indie: '',
      Location: '',
      StrongFemaleLead: '',
      Awards: '',
      CentralConflict: [],
      Affiliation: []
    }
    this.setState({ alertType: 'danger', selectedRow: selectedRow, alertMsj: movieName + ' was deleted!' })
  }

  csvToJson (csv) {
    const content = csv.split('\n')
    const header = content[0].split(',')
    return _.tail(content).map((row) => {
      return _.zipObject(header, row.split(','))
    })
  }

  getUploadMovieData (data) {
    const reader = new FileReader()
    let text = ''
    function csvToJson (csv) {
      const content = csv.split('\n')
      const header = content[0].split(',')
      return _.tail(content).map((row) => {
        return _.zipObject(header, row.split(','))
      })
    }
    function onlyUnique (value, index, self) {
      return self.indexOf(value) === index
    }
    reader.readAsText(data.file)
    const self = this
    reader.onload = function (e) {
      text = csvToJson(reader.result)
      const array = []
      for (let i = 0; i < text.length; i++) {
        const tempObj = {
          Movie: text[i].Movie,
          Year: text[i].Year,
          Awards: text[i].Awards,
          Indie: text[i].Indie,
          Location: text[i].Location,
          StrongFemaleLead: text[i]['Strong Female Lead'],
          CentralConflict: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Central Conflict') }).map((e) => text[i][e]),
          Genre: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Genre') }).map((e) => text[i][e]).filter((x) => x !== ''),
          SimilarActor: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Actor') }).map((e) => text[i][e]).filter((x) => x !== ''),
          Actor: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Actor') })
            .map((e) => text[i][e]).filter((x) => x !== '')
            .filter(x => Object.keys(text[i])
              .filter(function (k) { return ~k.indexOf('Similar Actor') })
              .map((e) => text[i][e]).filter((x) => x !== '').indexOf(x) < 0),
          Director: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Director') })
            .map((e) => text[i][e]).filter((x) => x !== '')
            .filter(x => Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Director') })
              .map((e) => text[i][e]).filter((x) => x !== '').indexOf(x) < 0),
          SimilarDirector: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Director') }).map((e) => text[i][e]).filter((x) => x !== ''),
          Affiliation: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Affiliation') }).map((e) => text[i][e]).filter((x) => x !== '' && x !== '\r')
        }
        array.push(tempObj)
      }
      // FILTER ACTORS
      const actors = [].concat.apply([], array.map(x => x.Actor)).filter(onlyUnique)
      const similarActors = [].concat.apply([], array.map(x => x.SimilarActor)).filter(onlyUnique)
      const fullActors = _.union(actors, similarActors)
      const actorsObj = []
      fullActors.map(x => actorsObj.push({ name: x }))
      // FILTER DIRECTORS
      const directors = [].concat.apply([], array.map(x => x.Director)).filter(onlyUnique)
      const similarDirectors = [].concat.apply([], array.map(x => x.SimilarDirector)).filter(onlyUnique)
      const fullDirectors = _.union(directors, similarDirectors)
      const directorsObj = []
      fullDirectors.map(x => directorsObj.push({ name: x }))
      // FILTER GENRES
      const genres = [].concat.apply([], array.map(x => x.Genre)).filter(onlyUnique)
      const genresObj = []
      genres.map(x => genresObj.push({ name: x }))
      // FILTER CONFLICTS
      const conflicts = [].concat.apply([], array.map(x => x.CentralConflict)).filter(onlyUnique)
      const conflictsObj = []
      conflicts.map(x => conflictsObj.push({ name: x }))
      // FILTER AFFILIATIONS
      const affiliations = [].concat.apply([], array.map(x => x.Affiliation)).filter(onlyUnique)
      const affiliationsObj = []
      affiliations.map(x => affiliationsObj.push({ name: x }))
      // FILTER LOCATION
      const locations = [].concat.apply([], array.map(x => x.Location)).filter(x => x !== '').filter(onlyUnique)
      const locationsObj = []
      locations.map(x => locationsObj.push({ name: x }))

      const uploadData = {
        movies: array,
        actors: actorsObj,
        directors: directorsObj,
        genres: genresObj,
        conflicts: conflictsObj,
        affiliations: affiliationsObj,
        locations: locationsObj
      }
      const promisesArr = [self.uploadMovies(uploadData.movies),
        self.props.uploadActors(uploadData.actors),
        self.props.uploadDirectors(uploadData.directors),
        self.props.uploadAffiliations(uploadData.affiliations),
        self.props.uploadConflicts(uploadData.conflicts),
        self.props.uploadGenres(uploadData.genres),
        self.props.uploadLocations(uploadData.locations)
        ]

      Promise.all(promisesArr).then((d) => { console.log('--Getting Data--'); self.getMovieData() })
    }
  }

  uploadMovie (file) {
    this.setState({displayLoader: 'initial'})
    this.getUploadMovieData(file)
  }

  render () {
    if (typeof window.sessionStorage['userIsLogedIn'] === 'undefined') {
      window.location = './login'
    } else {
      const selectRowProp = {
        mode: 'radio',
        clickToSelect: true,
        bgColor: 'rgb(238, 193, 213)',
        onSelect: this.onRowSelect
      }

      const addlSelectedRowProp = {
        mode: 'radio',
        clickToSelect: true,
        bgColor: 'rgb(238, 193, 213)',
        onSelect: this.onAddlRowSelect
      }

      const addlCellEditProp = {
        mode: 'click',
        blurToSave: true,
        afterSaveCell: this.onAfterAddlCellEdit
      }
      return (

      <div className={'container-fluid'}>
        <div className={'row'}>
          <Alert bsStyle={this.state.alertType} >
            <h4>Status</h4>
            <p>{this.state.alertMsj}</p>
          </Alert>
            <div className={'col-md-4 panel panel-default'}>
              <div className={'panel-body'}>
              <UploadFile onMoviesUpload={this.uploadMovie} />
              <img src={Loader} alt='HTML5 Icon' style={{display: this.state.displayLoader}} />
              <form onSubmit={this.handleSubmit} id='addMovieForm'>
              <label>Movie</label>
              <input className={'form-control'}
                name='form-movie-name'
                placeholder='Movie name'
                required
                value={this.state.Movie}
                onChange={this.onMovieChange} />
              <br />
              <label>Year</label>
              <input className={'form-control'} name='form-year' placeholder='Year'
                required
                type='number'
                min='1900'
                max='2099'
                value={this.state.Year}
                onChange={this.onYearChange} />
              <br />
              <label>Genres </label>
              <Select
                name='form-genres'
                options={this.state.Genre}
                multi
                allowCreate
                required='true'
              />
              <br />
              <label>Directors </label>
              <Select
                name='form-directors'
                options={this.state.Directors}
                multi
                allowCreate
              />
              <br />
              <label>Actors </label>
              <Select
                name='form-actors'
                options={this.state.Actors}
                multi
                allowCreate
              />
              <br />
              <label>Similar Directors </label>
              <Select
                name='form-sim-directors'
                options={this.state.Directors}
                multi
                allowCreate
              />
              <br />
              <label>Similar Actors </label>
              <Select
                name='form-sim-actors'
                options={this.state.Actors}
                multi
                allowCreate
              />
              <br />
              <label>Central Conflicts </label>
              <Select
                name='form-conflicts'
                options={this.state.Conflicts}
                multi
                allowCreate
              />
              <br />
              <label>Location </label>
              <Select
                name='form-location'
                options={this.state.Locations}
                allowCreate
              />
              <br />
              <label>Affiliations </label>
              <Select
                name='form-affiliations'
                options={this.state.Affiliations}
                multi
                allowCreate
              />
              <br />
              <label>Strong Female Lead</label>
              <input type='checkbox' name='form-female-lead' defaultChecked />
              <br />
              <label>Indie</label>
              <input type='checkbox' name='form-indie' defaultChecked />
              <br />
              <label>Awards</label>
              <input type='checkbox' name='form-awards' defaultChecked />
              <br />
              <input type='submit' value='Submit' className={'btn btn-success'} />
              </form>
            </div>
            </div>
            <div className={'col-md-8 panel panel-default'}>
            <Tabs defaultActiveKey={1} id='uncontrolled-tab-example'>
              <Tab eventKey={1} title='Movies Management'>

            <div className={classes['edit-button']} style={{display: 'inline'}}>
            <input type='button' className={'btn btn-primary'} style={{float: 'left', marginLeft: '10px', marginTop: '26px'}} value='Edit Movie' onClick={this.editMovie} />
            <input type='button' className={'btn btn-danger'} value='Delete Movie' style={{float: 'right', marginTop: '26px', marginRight: '10px'}} onClick={this.deleteMovie} />
              </div>
              <BootstrapTable data={this.state.Movies} search pagination selectRow={selectRowProp}>
                <TableHeaderColumn dataField='_id' hidden isKey>Movie ID</TableHeaderColumn>
                <TableHeaderColumn dataField='Movie'>Movie</TableHeaderColumn>
              </BootstrapTable>
              <Modal show={this.state.showModal} onHide={this.close}>
                <ModalHeader closeButton>
                  <ModalTitle>Edit Movie</ModalTitle>
                </ModalHeader>
                <ModalBody>
                <form id='edit-movie-form'>
                  <label>Movie</label>
                  <input className={'form-control'} name='form-movie-name' value={this.state.selectedRow.Movie} onChange={this.onMovieNameChange} placeholder='Movie name' />
                  <br />
                  <label>Year</label>
                  <input className={'form-control'} name='form-year' value={this.state.selectedRow.Year} onChange={this.onYearValChange} placeholder='Year' />
                  <br />
                  <label>Genres </label>
                  <Select
                    name='form-genres'
                    options={this.state.Genre}
                    value={this.state.selectedRow.Genre}
                    multi
                    allowCreate
                  />
                  <br />
                  <label>Directors </label>
                  <Select
                    name='form-directors'
                    options={this.state.Directors}
                    value={this.state.selectedRow.Director}
                    multi
                    allowCreate
                  />
                  <br />
                  <label>Actors </label>
                  <Select
                    name='form-actors'
                    options={this.state.Actors}
                    value={this.state.selectedRow.Actor}
                    multi
                    allowCreate
                  />
                  <br />
                  <label>Similar Directors </label>
                  <Select
                    name='form-sim-directors'
                    options={this.state.Directors}
                    value={this.state.selectedRow.SimilarDirector}
                    multi
                    allowCreate
                  />
                  <br />
                  <label>Similar Actors </label>
                  <Select
                    name='form-sim-actors'
                    options={this.state.Actors}
                    value={this.state.selectedRow.SimilarActor}
                    multi
                    allowCreate
                  />
                  <br />
                  <label>Central Conflicts </label>
                  <Select
                    name='form-conflicts'
                    options={this.state.Conflicts}
                    value={this.state.selectedRow.CentralConflict}
                    multi
                    allowCreate
                  />
                  <br />
                  <label>Location </label>
                  <Select
                    name='form-location'
                    options={this.state.Locations}
                    value={this.state.selectedRow.Location}
                    allowCreate
                  />
                  <br />
                  <label>Affiliations </label>
                  <Select
                    name='form-affiliations'
                    options={this.state.Affiliations}
                    value={this.state.selectedRow.Affiliation}
                    multi
                    allowCreate
                  />
                  <br />
                  <label>Strong Female Lead</label>
                  <input type='checkbox' name='form-female-lead' checked={this.state.hasFemaleLead} onClick={this.handleFemaleClick} defaultChecked />
                  <br />
                  <label>Indie</label>
                  <input type='checkbox' name='form-indie' checked={this.state.isIndie} onClick={this.handleIndieClick} defaultChecked />
                  <br />
                  <label>Awards</label>
                  <input type='checkbox' name='form-awards' checked={this.state.hasAwards} onClick={this.handleAwardsClick} defaultChecked />
                  <br />
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={this.updateMovie} className={'btn-success'}>Update</Button>
                  <Button onClick={this.close}>Close</Button>
                </ModalFooter>
              </Modal>
              </Tab>
              <Tab eventKey={2} title='Third party data'>
                <div style={{marginTop: '20px'}}>
                  <label style={{float: 'left'}}>Get posters for movies. Required after adding a movie or uploading movies</label>
                  <br />
                  <br />
                  <Button onClick={this.getAddlData} className={'btn-success'} style={{float: 'left'}} >Get posters and RT scores</Button>
                  <img src={Loader} alt='HTML5 Icon' style={{float: 'left', marginTop: '7px', marginLeft: '30px', display: this.state.displayAddlLoader}} />
                  <br />
                  <br />
                  <hr />
                  <br />
                  <BootstrapTable data={this.state.Movies} search pagination cellEdit={addlCellEditProp} selectRow={addlSelectedRowProp}>
                    <TableHeaderColumn dataField='_id' hidden isKey>Movie ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='Movie' editable={false}>Movie</TableHeaderColumn>
                    <TableHeaderColumn dataField='addPoster'>Poster URI</TableHeaderColumn>
                    <TableHeaderColumn dataField='addPlot'>Plot</TableHeaderColumn>
                    <TableHeaderColumn dataField='addTomatoMeter' width='60'>RT Meter</TableHeaderColumn>
                    <TableHeaderColumn dataField='addTomatoUserMeter' width='60'>RT User Meter</TableHeaderColumn>
                    <TableHeaderColumn dataField='addTomatoRating' width='60'>RT Rating</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </Tab>
              <Tab eventKey={3} title='Point system management'></Tab>
            </Tabs>
            </div>

        </div>
      </div>
    )
    } }
}
