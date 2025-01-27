import React from 'react'
import qs from 'qs'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import {useAppDispatch} from '../redux/store'
import {selectFilter} from '../redux/filter/selectors'
import {selectPizzaData} from '../redux/pizza/selectors'
import {setCategoryId, setCurrentPage, setFilters} from '../redux/filter/filterSlice'
import {fetchPizzas} from '../redux/pizza/asyncActions'
import {SearchPizzaParams} from '../redux/pizza/types'
import {Categories, Sort, PizzaBlock, Pagination, LoadingBlock, sortList} from '../components'


const Home = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const isMounted = React.useRef(false)

    const {items, status} = useSelector(selectPizzaData)
    const {categoryId, sort, currentPage, searchValue} = useSelector(selectFilter)

    const onChangeCategory = React.useCallback((idx: number) => {
        dispatch(setCategoryId(idx))
    }, [])

    const onChangePage = (page: number) => {
        dispatch(setCurrentPage(page))
    }

    const getPizzas = async () => {
        const sortBy = sort.sortProperty.replace('-', '')
        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
        const category = categoryId > 0 ? String(categoryId) : ''
        const search = searchValue

        dispatch(
            fetchPizzas({
                sortBy,
                order,
                category,
                search,
                currentPage: String(currentPage)
            })
        )

        window.scrollTo(0, 0)
    }


    // Если изменили параметры и был первый рендер
    React.useEffect(() => {
        if (isMounted.current) {
            const params = {
                categoryId: categoryId > 0 ? categoryId : null,
                sortProperty: sort.sortProperty,
                currentPage
            }

            const queryString = qs.stringify(params, {skipNulls: true})

            navigate(`/?${queryString}`)
        }

        getPizzas()
        isMounted.current = true
    }, [categoryId, sort.sortProperty, searchValue, currentPage])

    // Парсим параметры при первом рендере
    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams
            const sort = sortList.find((obj) => obj.sortProperty === params.sortBy)
            dispatch(
                setFilters({
                    searchValue: params.search,
                    categoryId: Number(params.category),
                    currentPage: Number(params.currentPage),
                    sort: sort || sortList[0],
                }),
            )
        }
        isMounted.current = true
    }, [])

    const pizzas = items.map(obj => <PizzaBlock key={obj.id} {...obj} />)
    const skeletons = [...new Array(6)].map((_, index) => <LoadingBlock key={index}/>)

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
                <Sort value={sort}/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {status === 'error' ? (
                <div className="content__error-info">
                    <h2>Произошла ошибка 😕</h2>
                    <p>К сожалению, не удалось получить питсы. Попробуйте повторить попытку позже.</p>
                </div>
            ) : (
                <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
            )}
            <Pagination currentPage={currentPage} onCurrentPage={onChangePage}/>
        </div>
    )
}

export default Home
