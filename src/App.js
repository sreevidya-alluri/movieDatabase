import {Component} from 'react'

import {BrowserRouter, Switch, Route} from 'react-router-dom'

import './App.css'
import Header from './components/Header'
import Popular from './components/Popular'
import TopRated from './components/TopRated'
import Upcoming from './components/Upcoming'
import Footer from './components/Footer'
import Context from './context/Context'
import SingleMovieDetails from './components/SingleMovieDetails'
import SearchMoviesDetails from './components/SearchMovieDetails'

class App extends Component {
  state = {
    search: '',
    currentPage: 1,
    searchList: [],
    loading: true,
    activePage: 'Popular', // Track the active page
    popularMovies: [],
    topRatedMovies: [],
    upcomingMovies: [],
  }

  componentDidMount() {
    this.getPopularMovies()
    this.getTopRatedMovies()
    this.getUpcomingMovies()
  }

  caseConvert = arr =>
    arr.map(item => ({
      id: item.id,
      posterPath: item.poster_path,
      title: item.title,
      voteAverage: item.vote_average,
    }))

  getPopularMovies = async (page = 1) => {
    const PopularApi = `https://api.themoviedb.org/3/movie/popular?api_key=b24ca4a28f7cce57aca325b6f144c729&language=en-US&page=${page}`
    const response = await fetch(PopularApi)
    if (response.ok) {
      const dataObj = await response.json()
      const modifiedMovieList = this.caseConvert(dataObj.results)
      this.setState({
        popularMovies: modifiedMovieList,
        currentPage: page,
        loading: false,
      })
    }
  }

  getTopRatedMovies = async (page = 1) => {
    const TopRatedApi = `https://api.themoviedb.org/3/movie/top_rated?api_key=b24ca4a28f7cce57aca325b6f144c729&language=en-US&page=${page}`
    const response = await fetch(TopRatedApi)
    if (response.ok) {
      const dataObj = await response.json()
      const modifiedMovieList = this.caseConvert(dataObj.results)
      this.setState({
        topRatedMovies: modifiedMovieList,
        currentPage: page,
        loading: false,
      })
    }
  }

  getUpcomingMovies = async (page = 1) => {
    const UpcomingApi = `https://api.themoviedb.org/3/movie/upcoming?api_key=b24ca4a28f7cce57aca325b6f144c729&language=en-US&page=${page}`
    const response = await fetch(UpcomingApi)
    if (response.ok) {
      const dataObj = await response.json()
      const modifiedMovieList = this.caseConvert(dataObj.results)
      this.setState({
        upcomingMovies: modifiedMovieList,
        currentPage: page,
        loading: false,
      })
    }
  }

  searchFn = query => {
    this.setState({search: query, loading: true}, this.getSearchMovies)
  }

  getSearchMovies = async (page = 1) => {
    const {search} = this.state
    const SearchApi = `https://api.themoviedb.org/3/search/movie?api_key=b24ca4a28f7cce57aca325b6f144c729&language=en-US&query=${search}&page=${page}`
    const response = await fetch(SearchApi)
    if (response.ok) {
      const dataObj = await response.json()
      const modifiedMovieList = this.caseConvert(dataObj.results)
      this.setState({
        searchList: modifiedMovieList,
        currentPage: page,
        loading: false,
      })
    }
  }

  render() {
    const {
      search,
      searchList,
      loading,
      currentPage,
      popularMovies,
      topRatedMovies,
      upcomingMovies,
      activePage,
    } = this.state

    return (
      <Context.Provider
        value={{
          search,
          loading,
          currentPage,
          searchList,
          popularMovies,
          topRatedMovies,
          upcomingMovies,
          searchFn: this.searchFn,
          getPopularMovies: this.getPopularMovies,
          getTopRatedMovies: this.getTopRatedMovies,
          getUpcomingMovies: this.getUpcomingMovies,
          setActivePage: page => this.setState({activePage: page}),
        }}
      >
        <BrowserRouter>
          <main className="main-container">
            <Header />
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Switch>
                <Route exact path="/">
                  <Popular />
                </Route>
                <Route exact path="/top-rated">
                  <TopRated />
                </Route>
                <Route exact path="/upcoming">
                  <Upcoming />
                </Route>
                <Route exact path="/movie/:id" component={SingleMovieDetails} />
                <Route exact path="/search" component={SearchMoviesDetails} />
              </Switch>
            )}
            <Footer />
          </main>
        </BrowserRouter>
      </Context.Provider>
    )
  }
}

export default App
