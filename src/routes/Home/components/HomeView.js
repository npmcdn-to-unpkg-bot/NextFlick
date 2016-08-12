import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import classes from './HomeView.scss'

export const HomeView = () => (
  <div className={'center-block'}>
    <img
      alt='This is a duck, because Redux!'
      className={classes.duck}
      src={DuckImage} />
    <p className={'help-block'}>What will you watch next?</p>
    <form>
      <div className={'form-group text-center'}>
        <input type='email' className={'form-control'} />
        <p className={'help-block'}>Type in the name of a movie or TV show and get movie recommendations!</p>
      </div>
      <button type='submit' className='btn btn-default'>Recommend !</button>
    </form>
  </div>
)

export default HomeView
