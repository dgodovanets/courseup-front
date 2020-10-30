import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import styles from './VideoPage.module.scss';
import PlayerExample from '../../components/Video/Video';
import PlayerControlExample from '../Video/Video';

const { REACT_APP_API: api } = process.env;

export class VideoPage extends Component {
    state = {
        textMaterials: [],
        nextVideoMaterialNumber: null,
        currentNumber: null
    };

    componentDidMount() {
        const { courseId, textNumber } = this.props.match.params;

        // console.log(this.props.match);
        fetch(`${api}/courses/${courseId}?readPopulate=true`)
            .then((result) => result.json())
            .then((response) => {
                const updatedState = {};

                const fetchedText = response.data.course.materials.texts[textNumber - 1];
                updatedState.textMaterials = fetchedText.text.split('\\n');
                updatedState.currentNumber = parseInt(textNumber);

                if (response.data.course.materials.texts.length > textNumber) {
                    updatedState.nextVideoMaterialNumber = parseInt(textNumber) + 1;
                }

                this.setState(updatedState);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        const formattedText = this.state.textMaterials.map((part, i) => <p key={i}>{part}</p>);
        let nextButton = (
            <Link to="/">
                <Button>Go to videos</Button>
            </Link>
        );
        let backButton = (
            <Link to={this.props.match.url.substring(0, this.props.match.url.indexOf('read'))}>
                <Button>Back to course page</Button>
            </Link>
        );
        
        if (this.state.nextVideoMaterialNumber) {

            const redirectLink =
                this.props.match.url.slice(0, this.props.match.url.lastIndexOf('/') + 1) +
                this.state.nextVideoMaterialNumber; 

            nextButton = (
                <Link
                    to={redirectLink}
                    onClick={() => {
                        setTimeout(() => {
                            window.location.reload()
                        }, 200); 
                    }}
                >
                    <Button>Next</Button>
                </Link>
            );
        }

        if (this.state.currentNumber !== 1) {

            const redirectLink =
                this.props.match.url.slice(0, this.props.match.url.lastIndexOf('/') + 1) +
                (this.state.currentNumber - 1);

            console.log(redirectLink);

            backButton = (
                <Link
                    to={redirectLink}
                    onClick={() => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 200);
                    }}
                >
                    <Button>Previous</Button>
                </Link>
            );
        }

        return (
            <div className={styles.VideoPage}>
                <div className="center-content">
                    <h2>Lesson {this.state.currentNumber}</h2>
                    {formattedText}
                </div>
                <div className="center-content">
                    <div className={styles.Footer}>
                    <PlayerControlExample />
                        {backButton}
                        {nextButton}
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoPage;