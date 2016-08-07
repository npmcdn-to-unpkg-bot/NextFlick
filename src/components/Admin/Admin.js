import React from 'react'
import UploadFile from 'components/Utils/UploadFile'
import Select from 'react-select'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Modal, Button, Alert} from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import 'react-bootstrap-table/css/react-bootstrap-table-all.min.css'
import $ from 'jquery'

export default class Admin extends React.Component {
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
      alertMsj: 'Everything is up to date.',
      showAlert: true,
      alertType: 'info',
      showModal: false,
      isIndie: true,
      hasAwards: true,
      hasFemaleLead: true
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
    this.getMovieData = this.getMovieData.bind(this)
    this.handleIndieClick = this.handleIndieClick.bind(this)
    this.handleAwardsClick = this.handleAwardsClick.bind(this)
    this.handleFemaleClick = this.handleFemaleClick.bind(this)
    this.updateIndieClick = this.updateIndieClick.bind(this)
    this.updateAwardsClick = this.updateAwardsClick.bind(this)
    this.updateFemaleClick = this.updateFemaleClick.bind(this)
  }

  componentDidMount () {
    this.getMovieData()
  }

  getMovieData () {
    this.props.getData().then((res) => { this.setState({Movies: res.movies.data}) })
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
      Genre: serializeData.filter(x => x.name === 'form-genres').length === 1 ? serializeData.filter(x => x.name === 'form-genres')[0].value.split(',').map(x => x.trim()) : '',
      Director: serializeData.filter(x => x.name === 'form-directors').length === 1 ? serializeData.filter(x => x.name === 'form-directors')[0].value.split(',').map(x => x.trim()) : '',
      Actor: serializeData.filter(x => x.name === 'form-actors').length === 1 ? serializeData.filter(x => x.name === 'form-actors')[0].value.split(',').map(x => x.trim()) : '',
      SimilarDirector: serializeData.filter(x => x.name === 'form-sim-directors').length === 1 ? serializeData.filter(x => x.name === 'form-sim-directors')[0].value.split(',').map(x => x.trim()) : '',
      SimilarActor: serializeData.filter(x => x.name === 'form-sim-actors').length === 1 ? serializeData.filter(x => x.name === 'form-sim-actors')[0].value.split(',').map(x => x.trim()) : '',
      Indie: indie,
      Location: serializeData.filter(x => x.name === 'form-location').length === 1 ? serializeData.filter(x => x.name === 'form-location')[0].value : '',
      StrongFemaleLead: strongFemaleLead,
      Awards: awards,
      CentralConflict: serializeData.filter(x => x.name === 'form-conflicts').length === 1 ? serializeData.filter(x => x.name === 'form-conflicts')[0].value.split(',').map(x => x.trim()) : '',
      Affiliation: serializeData.filter(x => x.name === 'form-affiliations').length === 1 ? serializeData.filter(x => x.name === 'form-affiliations')[0].value.split(',').map(x => x.trim()) : ''
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
      Genre: serializeData.filter(x => x.name === 'form-genres').length === 1 ? serializeData.filter(x => x.name === 'form-genres')[0].value.split(',').map(x => x.trim()) : '',
      Director: serializeData.filter(x => x.name === 'form-directors').length === 1 ? serializeData.filter(x => x.name === 'form-directors')[0].value.split(',').map(x => x.trim()) : '',
      Actor: serializeData.filter(x => x.name === 'form-actors').length === 1 ? serializeData.filter(x => x.name === 'form-actors')[0].value.split(',').map(x => x.trim()) : '',
      SimilarDirector: serializeData.filter(x => x.name === 'form-sim-directors').length === 1 ? serializeData.filter(x => x.name === 'form-sim-directors')[0].value.split(',').map(x => x.trim()) : '',
      SimilarActor: serializeData.filter(x => x.name === 'form-sim-actors').length === 1 ? serializeData.filter(x => x.name === 'form-sim-actors')[0].value.split(',').map(x => x.trim()) : '',
      Indie: indie,
      Location: serializeData.filter(x => x.name === 'form-location').length === 1 ? serializeData.filter(x => x.name === 'form-location')[0].value : '',
      StrongFemaleLead: strongFemaleLead,
      Awards: awards,
      CentralConflict: serializeData.filter(x => x.name === 'form-conflicts').length === 1 ? serializeData.filter(x => x.name === 'form-conflicts')[0].value.split(',').map(x => x.trim()) : '',
      Affiliation: serializeData.filter(x => x.name === 'form-affiliations').length === 1 ? serializeData.filter(x => x.name === 'form-affiliations')[0].value.split(',').map(x => x.trim()) : ''
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
  render () {
    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      bgColor: 'rgb(238, 193, 213)',
      onSelect: this.onRowSelect
    }

   

    return (
      <div className={'container-fluid'}>
        <div className={'row'}>
          <Alert bsStyle={this.state.alertType} >
            <h4>Status</h4>
            <p>{this.state.alertMsj}</p>
          </Alert>
            <div className={'col-md-4'}>
              <UploadFile onMoviesUpload={this.props.uploadMovie} />
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
              <input type='submit' value='Submit' />
              </form>
            </div>
            <div className={'col-md-8'}>
            <input type='button' className={'btn btn-default'} value='Edit Movie' onClick={this.editMovie} />
              <BootstrapTable data={this.state.Movies} search pagination selectRow={selectRowProp}>
                <TableHeaderColumn dataField='_id' hidden isKey>Movie ID</TableHeaderColumn>
                <TableHeaderColumn dataField='Movie'>Movie</TableHeaderColumn>
              </BootstrapTable>
              <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form id='edit-movie-form'>
                  <label>Movie</label>
                  <input className={'form-control'} name='form-movie-name' value={this.state.selectedRow.Movie} placeholder='Movie name' />
                  <br />
                  <label>Year</label>
                  <input className={'form-control'} name='form-year' value={this.state.selectedRow.Year} placeholder='Year' />
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
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.updateMovie}>Update</Button>
                  <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
        </div>
      </div>
    )
  }
}
