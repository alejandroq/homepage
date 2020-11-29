import Link from 'next/link';
import styles from './Header.module.css';
import { BackContext } from '../context/BackProvider';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faFile } from '@fortawesome/free-solid-svg-icons';

const SocialIcons = () => {
    return (
        <div className={styles.right_item}>
            <a className={styles.right_item_item} href={"https://github.com/alejandroq"} target="_blank">
                <FontAwesomeIcon
                    style={{ height: "2rem" }}
                    icon={faGithub}
                    fixedWidth
                />
            </a>
            <a className={styles.right_item_item} href={"https://www.linkedin.com/in/quesadaalejandro"} target="_blank">
                <FontAwesomeIcon
                    style={{ height: "2rem" }}
                    icon={faLinkedinIn}
                    fixedWidth
                />
            </a>
            <a className={styles.right_item_item} href={"https://twitter.com/redpause"} target="_blank">
                <FontAwesomeIcon
                    style={{ height: "2rem" }}
                    icon={faTwitter}
                    fixedWidth
                />
            </a>
            <a className={styles.right_item_item} href={"/resume.pdf"} target="_blank">
                <FontAwesomeIcon
                    style={{ height: "2rem" }}
                    icon={faFile}
                    fixedWidth
                />
            </a>
        </div>
    )
}

export default function Header({ className }) {
    const { back: isEnabled, clicked } = useContext(BackContext);

    return (
        <header className={className}>
            <div className={styles.container}>
                {
                    isEnabled
                        ? <div className={styles.left_item} onClick={clicked}>
                            <a href="javascript:void(0);" className={styles.no_underline} >
                                <FontAwesomeIcon
                                    style={{ height: "1rem" }}
                                    icon={faArrowLeft}
                                    fixedWidth
                                />&nbsp;
                                Back
                                </a>
                        </div>
                        : <div className={styles.left_item}>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                }

                <h1 className={styles.title}>
                    <Link href="/" passHref>
                        <a className={styles.hidden_link}>Alejandro Quesada's Homepage</a>
                    </Link>
                </h1>

                <SocialIcons />
            </div>
        </header>
    );
}