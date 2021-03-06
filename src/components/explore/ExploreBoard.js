// This component is responsible for rendering the explore section of the app

import React, { Component } from 'react';
import ExploreCard from './ExploreCard';
import './Explore.css'

export default class ExploreBoard extends Component {
    state = {
        filteredCocktails: [],
        checkboxValue: "",
        categorySelection: "",
        searchInput: ""
    }

    handleSearchInput = event => {
        let searchValue = event.target.value;
        this.setState({
            searchInput: searchValue
        });
        if (this.state.checkboxValue || this.state.categorySelection !== "") {
            this.setState({
                filteredCocktails: this.state.filteredCocktails.filter(cocktail => {
                    return cocktail.name.includes(searchValue);
                })
            })
        } else {
            this.setState({
                filteredCocktails: this.props.cocktails.filter(cocktail => {
                    return cocktail.name.includes(searchValue);
                })
            })
        }
    }

    handleClearFilters = () => {
        this.setState({
            checkboxValue: false,
            categorySelection: "",
            searchInput: "",
            filteredCocktails: this.props.cocktails
        })
    }

    handleCategorySelection = event => {
        let categoryValue = event.target.value;
        if (this.state.checkboxValue) {
            this.setState({
                categorySelection: categoryValue,
                filteredCocktails: this.state.filteredCocktails.filter(cocktail => {
                    return cocktail.category === categoryValue;
                })
            })
        } else {
            this.setState({
                categorySelection: categoryValue,
                filteredCocktails: this.props.cocktails.filter(cocktail => {
                    return cocktail.category === categoryValue;
                })
            })
        }
    }

    filterByIngredients = () => {
        let userIngredients = this.props.userIngredients.filter(ingr => {
            return ingr.userId === Number(localStorage.getItem("userId"));
        });
        this.setState({
            filteredCocktails: this.state.filteredCocktails.filter(cocktail => {
                if (cocktail.id > 77) {
                    let cocktailIngredients = this.props.cocktailIngredients.filter(ingr => {
                        return ingr.cocktailId === cocktail.id;
                    });
                    let canMake = cocktailIngredients.every(cocktailIngr => {
                        return userIngredients.find(ingr => ingr.ingredientId === cocktailIngr.ingredientId)
                    });
                    if (canMake) {
                        return cocktail
                    } else {
                        return null
                    }
                } else {
                    let canMake = cocktail.ingredients.every(cocktailIngr => {
                        if (userIngredients.find(ingr => ingr.ingredient.name === cocktailIngr.ingredient) || cocktailIngr.special) {
                            return true
                        } else {
                            return false
                        }
                    });
                    if (canMake) {
                        return cocktail
                    } else {
                        return null
                    }
                }
            })
        });
    }

    handleFilterCheckbox = () => {
        if (this.state.checkboxValue === false) {
            this.filterByIngredients();
            this.setState({
                checkboxValue: !this.state.checkboxValue
            });
        } else {
            this.setState({
                checkboxValue: !this.state.checkboxValue,
                filteredCocktails: this.props.cocktails
            });
        }
    }

    componentWillReceiveProps() {
        this.setState({
            filteredCocktails: this.props.cocktails,
        })
        if (this.state.checkboxValue) {
            this.filterByIngredients();
        }
    }

    componentWillMount() {
        this.setState({
            filteredCocktails: this.props.cocktails,
            checkboxValue: false
        })
    }

    render() {
        return (
            <React.Fragment>
                <p className="exploreHeader">Explore</p>
                <hr className="custom-hr" />
                <section className="filters-section">
                    <p className="exploreSubHeader">Filters</p>
                    <span />
                    <input type="text"
                    value={this.state.searchInput}
                    placeholder="Search by Name..."
                    name="searchInput"
                    onChange={this.handleSearchInput} />
                    <span />
                    <fieldset>
                        <label htmlFor="ingredientFilter">Filter By Available Ingredients:</label>
                        <span />
                        <input type="checkbox"
                        checked={this.state.checkboxValue}
                        name="ingredientFilter"
                        onChange={this.handleFilterCheckbox} />
                    </fieldset>
                    <span />
                    <select value={this.state.categorySelection}
                    name="categorySelection"
                    onChange={this.handleCategorySelection}>
                    <option value="" disabled default hidden>Filter By Category...</option>
                    {
                        this.props.categoryOptions.map(category => {
                            return <option key={category.id}
                            className="option-custom"
                            value={category.name}>{category.name}</option>
                        })
                    }
                    </select>
                    <span />
                    <button type="button"
                    className="button is-light clear-filters-button"
                    onClick={this.handleClearFilters}>Clear Filters
                    </button>
                </section>
                {
                    this.state.filteredCocktails.map(cocktail => {
                        return <ExploreCard key={cocktail.id} {...this.props} cocktail={cocktail} />
                    })
                }
            </React.Fragment>
        )
    }
}