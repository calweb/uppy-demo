import React from 'react'
import { Core, DragDrop, Tus10, Dashboard, Webcam, Informer } from 'uppy'

class UploadComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      images: []
    }
    this.uppy = new Core({debug: true, autoProceed: false})
    this.uppy
      .use(Dashboard, {target: 'body', inline: true})
      .use(Webcam, {target: Dashboard})
      .use(Informer, {target: Dashboard})
      .use(Tus10, {
        endpoint: 'http://master.tus.io:8080/files/'
      })
      .run()

    this.addFile = this.addFile.bind(this)
    this.upload = this.upload.bind(this)

    this.uppy.emitter.on('upload-success', (fileID, uploadURL) => {
      console.log(fileID, uploadURL)
      this.uppy.addThumbnail(fileID)
      console.log('logging state', this.uppy.state);
      const newImgArray = this.state.images.slice()
      newImgArray.push(uploadURL)
      this.setState({
        images: newImgArray
      })
    })

    this.uppy.emitter.on('upload-progress', () => {
      const newProgress = this.uppy.getState().totalProgress
      this.setState({
        progress: newProgress
      })
    })
  }

  addFile (ev) {
    const files = Array.from(ev.target.files)
    files.forEach((file) => {
      this.uppy.addFile({
        source: 'React input',
        name: file.name,
        type: file.type,
        alt: file.name,
        data: file
      })
    })
  }

  upload () {
    this.uppy.emitter.emit('core:upload')
  }


  render () {
    return <div style={{color: 'black'}}>
      <h1>yo yo</h1>

      <h4>{this.state.progress || null}</h4>
      {this.state.images.map((img) => {
        return <img width="200" src={img} alt={img.alt}/>
      })}
    </div>
  }
}

export default UploadComponent
