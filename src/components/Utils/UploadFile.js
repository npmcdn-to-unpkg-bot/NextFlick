import React, { Component } from 'react'

let fileData = null
export default class UploadFile extends Component {
  constructor (props) {
    super(props)
    this.onUpload = this.onUpload.bind(this)
  }

  onUpload (event) {
    const { onMoviesUpload } = this.props
    onMoviesUpload(fileData)
  }
  onUploadChanged (event) {
    const dataObj = {
      file: event.target.files[0],
      path: event.target.value
    }
    fileData = dataObj
  }

  render () {
    return (
      <div className={'form-group'}>
        <input type='file' id='exampleInputFile' onChange={this.onUploadChanged} />
        <p className={'help-block'}>Select a csv file to upload.</p>
        <button className={'btn btn-primary'} onClick={this.onUpload}>Upload</button>
      </div>
    )
  }
}
