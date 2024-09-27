import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import { useParams } from 'react-router-dom'

function Recipe() {
    const [details, setDetails] = useState({})
    const [activeTab, setActiveTab] = useState("instructions")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    let params = useParams();

    const fetchDetails = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await fetch(`https://api.spoonacular.com/recipes/${params.name}/information?apiKey=${process.env.REACT_APP_APIKEY}`)
            if (!data.ok) {
                throw new Error('Failed to fetch recipe details')
            }
            const detailData = await data.json()
            setDetails(detailData)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDetails()
    }, [params.name]);

    const handleImageError = (e) => {
        e.target.onerror = null; // Prevents looping
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
    }

    if (isLoading) return <LoadingMessage>Loading...</LoadingMessage>;
    if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;

    return (
        <DetailWrapper>
            <LeftColumn>
                <h2>{details.title}</h2>
                <ImageContainer>
                    <img 
                        src={details.image} 
                        alt={details.title}
                        onError={handleImageError}
                    />
                    <ImagePlaceholder style={{display: 'none'}}>
                        <p>Image not available</p>
                    </ImagePlaceholder>
                </ImageContainer>
            </LeftColumn>
            <Info>
                <ButtonWrapper>
                    <Button 
                        className={activeTab === 'instructions' ? 'active' : ''} 
                        onClick={() => setActiveTab('instructions')}
                    >
                        Instructions
                    </Button>
                    <Button 
                        className={activeTab === 'ingredients' ? 'active' : ''}
                        onClick={() => setActiveTab('ingredients')}
                    >
                        Ingredients
                    </Button>
                </ButtonWrapper>
                {activeTab === 'instructions' && (
                    <div>
                        <h3 dangerouslySetInnerHTML={{__html: details.summary}}></h3>
                        <h3 dangerouslySetInnerHTML={{__html: details.instructions}}></h3>
                    </div>
                )}
                {activeTab === 'ingredients' && (
                    <ul>
                        {details.extendedIngredients && details.extendedIngredients.map((ingredient) => (
                            <li key={ingredient.id}>{ingredient.original}</li>
                        ))}
                    </ul> 
                )}
            </Info>
        </DetailWrapper>
    )
}

const DetailWrapper = styled.div`
    margin: 2rem auto;
    max-width: 1200px;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-start;
    }

    .active {
        background: linear-gradient(35deg, #494949, #313131);
        color: white;
    }

    h2 {
        margin-bottom: 2rem;
        font-size: 1.5rem;

        @media (min-width: 768px) {
            font-size: 2rem;
        }
    }

    li {
        font-size: 1rem;
        line-height: 1.5rem;

        @media (min-width: 768px) {
            font-size: 1.2rem;
            line-height: 2rem;
        }
    }

    ul {
        margin-top: 2rem;
    }
`

const LeftColumn = styled.div`
    flex: 1;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
        margin-bottom: 0;
        margin-right: 2rem;
    }
`

const ImageContainer = styled.div`
    width: 100%;
    max-width: 400px;
    margin: 0 auto;

    img {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 1rem;
    }
`

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    color: #313131;
    background: white;
    border: 2px solid black;
    margin-right: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 0.9rem;

    @media (min-width: 768px) {
        padding: 1rem 2rem;
        font-size: 1rem;
    }
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;
`

const Info = styled.div`
    flex: 2;

    h3 {
        font-size: 1rem;
        line-height: 1.5rem;
        margin-bottom: 1rem;

        @media (min-width: 768px) {
            font-size: 1.2rem;
            line-height: 1.8rem;
        }
    }
`

const ImagePlaceholder = styled.div`
    background-color: #f0f0f0;
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    
    p {
        color: #666;
        font-style: italic;
    }
`

const LoadingMessage = styled.div`
    text-align: center;
    font-size: 1.5rem;
    margin-top: 2rem;
    color: #333;
`

const ErrorMessage = styled.div`
    text-align: center;
    font-size: 1.5rem;
    margin-top: 2rem;
    color: #ff0000;
`

export default Recipe