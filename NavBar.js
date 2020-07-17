import React, { useState, useEffect, useLayoutEffect } from 'react';
import { makeStyles, ThemeProvider, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import Dialog from '@material-ui/core/Dialog';
import Fab from '@material-ui/core/Fab';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import logo from './LOGO1.png';
import YouTubeIcon from '@material-ui/icons/YouTube';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';

// animeJS
import anime from 'animejs';
import * as d3 from 'd3';
import { textwrap } from 'd3-textwrap';
import $ from 'jquery';
import HelpIcon from '@material-ui/icons/Help';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import * as d3Plus from 'd3plus-text';
// import {textWrap} from 'd3plus-text';
// import * as d3plus from './d3plus';

import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Chip from '@material-ui/core/Chip';
import './animeJS.css';



function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

//?: Credit source
//?: Mangolia and China Not coming correctly
//?: Fix second time play
//?: Add chips to next and prev in help
//?: Change icons in the kpis
//TODO: Build and publish in Firebase


// d3.textwrap = textwrap;

const useStyles = makeStyles((theme) => {
    console.log(theme);
    return ({
        root: {
            flexGrow: 1,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        fabButton: {
            position: 'absolute',
            zIndex: 1,
            top: 30,
            left: 0,
            right: 0,
            margin: '0 auto',
        },
        fabButtonMobile: {
            position: 'absolute',
            zIndex: 1,
            bottom: '-84vh',
            right: '30px',
            margin: '0 auto',
        },
        story: {
            width: "100vw",
            textAlign: "center",
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            background: '#1f1f1f',
            overflow: 'hidden',
            position: "absolute",
            justifyContent: 'space-evenly',
            padding: '10% 0',
            color: 'white',
        },
        story_title: {
            opacity: 0,
            color: 'white',
            fontSize: '5vw',
            marginTop: 0,
            marginBottom: 0,
        },
        story_subtitle: {
            opacity: 0,
            color: 'white',
            fontSize: '3vw',
            marginTop: 0,
            marginBottom: 0,
        },
        dialog: {
            // background: '#000',
        },
        circle: {
            width: '20px',
            height: '20px',
            background: 'white',
            borderRadius: '50%',
            transform: 'scale(0)',
            display: 'block',
            margin: '0 auto',
            position: 'absolute',
            left: 'calc(50% - 10px)',
        },
        progress: {
            width: '30vw',
            height: '10px',
            background: 'white',
            borderRadius: '5px',
            transform: 'scaleX(0)',
            display: 'block',
            margin: '1em auto',
            transformOrigin: 'left',
            minWidth: '300px',
        },
        story_numbers: {
            width: '30vw',
            margin: '0 auto',
            textAlign: 'left',
            opacity: 0,
            color: 'white',
            fontSize: 'calc(2em + (3 - 2) * ((100vw - 320px) / (1920 - 320)))',
            marginTop: 0,
            marginBottom: 0,
            minWidth: '300px',
        },
        story_numbers_value: {
            width: '30vw',
            margin: '0 auto',
            textAlign: 'left',
            opacity: 0,
            color: 'white',
            fontSize: 'calc(2em + (3 - 2) * ((100vw - 320px) / (1920 - 320)))',
            marginTop: 0,
            marginBottom: 0,
            minWidth: '300px',
        },
        percent: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            opacity: 0,
            color: 'white',
            fontWeight: 900,
            fontSize: 'calc(2.1em + (3 - 2.1) * ((100vw - 320px) / (1920 - 320)))',
        },
        line: {
            height: '2px',
            width: '100%',
            backgroundColor: 'white',
            opacity: 0,
        },
        numbersList: {
            listStyle: 'none',
            height: '14vh',
            overflow: 'hidden',
            textAlign: 'center',
            padding: '10px',
            background: 'white',
            borderRadius: '7vh',
            margin: "0px auto",
            width: '14vh',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            transform: 'scale(0)',

        },
        numbers: {
            height: 'auto',
            transform: 'translateY(14vh)',
            color: theme.palette.secondary.light,

        },
        rankText: {
            transform: 'scale(0)',
        },
    })
});

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// const theme = {
//   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
// };



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



function NavBar(props) {
    const testing = false;
    const classes = useStyles();

    // const country_name_input = 'US';


    const [rankByConfirmed, setRankByConfirmed] = useState([0, 0, 0, 0]);
    const [country_name_input, setCountry_name_input] = useState('');

    const [drawer, drawerState] = useState(false);
    const toggleDrawer = (open) => (event) => {

        drawerState(open);
    }
    let delay800 = 800,
        delay2000 = 2000,
        delay1500 = 1500,
        delay750 = 750,
        delay50 = 50,
        delay300 = 300,
        delay1000 = 1000;

    if (testing) {
        delay800 = 0;
        delay2000 = 0;
        delay1500 = 0;
        delay750 = 0;
        delay50 = 0;
        delay300 = 0;
        delay1000 = 0;
    }

    let values_d = [
        4109549,
        1447529,
        280751,
        2381269
    ];
    const [open, setOpen] = React.useState(false);
    const [values, setValues] = React.useState([]);
    const [countryName, setCountryName] = React.useState('');

    const getDataForCountry = () => {
        $('#main_story3').hide();
        $('#main_story4').hide();
        $('#main_story2').hide();
        fetch('https://corona-api.com/countries/' + country_name_input) //TODO: Replace country with global when nothing selected
            .then((response, d) => {
                response.json().then(result => {
                    let data = result.data;
                    console.log('country India', data);
                    setValues([
                        data.latest_data.confirmed,
                        data.latest_data.recovered,
                        data.latest_data.deaths,
                        data.latest_data.confirmed - data.latest_data.recovered - data.latest_data.deaths
                    ])
                    setCountryName(data.name)


                    setTimeout(()=>{
                        startStory([
                            data.latest_data.confirmed,
                            data.latest_data.recovered,
                            data.latest_data.deaths,
                            data.latest_data.confirmed - data.latest_data.recovered - data.latest_data.deaths
                        ], data);
                    }, 1000)


                    // startMainStory3();
                    // startMainStory4();

                });
            })
    }

    const startMainStory4 = () => {
        anime.timeline({ loop: false })
            .add({
                targets: '#main_story4 [data="mainRankTitle"]',
                scale: [100, 1],
                opacity: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay1000,
                complete: () => {
                    anime.timeline({ loop: false })

                    anime.timeline({ loop: false })
                        .add({
                            targets: '.ml8 .circle-white',
                            scale: [0, 3],
                            opacity: [1, 0],
                            easing: "easeInOutExpo",
                            rotateZ: 360,
                            duration: 1100
                        }).add({
                            targets: '.ml8 .circle-container',
                            scale: [0, 1],
                            opacity: [0, 1],
                            duration: 1100,
                            easing: "easeInOutExpo",
                            offset: '-=1000'
                        }).add({
                            targets: '.ml8 .circle-dark',
                            scale: [0, 1],
                            opacity: [0, 1],
                            duration: 1100,
                            easing: "easeOutExpo",
                            offset: '-=600'
                        })
                        .add({
                            targets: '.ml8 .letters-container',
                            opacity: [0, 1],
                            duration: 1100,
                            easing: "easeOutExpo",
                        })
                        .add({
                            targets: '.ml8 .letters-left',
                            scale: [0, 1],
                            opacity: [0, 1],
                            duration: 1200,
                            offset: '-=550'
                        }).add({
                            targets: '.ml8 .bang',
                            scale: [0, 1],
                            opacity: [0, 1],
                            rotateZ: [45, 15],
                            duration: 1200,
                            offset: '-=1000',
                            complete: () => {
                                anime.timeline({ loop: false })
                                    .add({
                                        targets: '#main_story4 [data="mainRankTitle2"]',
                                        scale: [100, 1],
                                        opacity: [0, 1],
                                        // rotate: '1turn',
                                        // color: '#000',
                                        easing: 'easeInOutExpo',
                                        duration: delay1000
                                    })
                            }
                        })
                    // .add({
                    //     targets: '.ml8',
                    //     opacity: 0,
                    //     duration: 1000,
                    //     easing: "easeOutExpo",
                    //     delay: 1400
                    // });

                    anime.timeline({ loop: false })
                        .add({
                            targets: '.ml8 .circle-dark-dashed',
                            opacity: [0, 1],
                            easing: "easeInOutExpo",
                            duration: 50
                        })
                    anime({
                        targets: '.ml8 .circle-dark-dashed',
                        rotateZ: 360,
                        duration: 8000,
                        easing: "linear",
                        loop: true
                    });



                }
            })
    }
    const startMainStory3 = () => {
        //Ranking
        anime.timeline({ loop: false })
            .add({
                targets: '#main_story3 [data="mainRankTitle"]',
                scale: [100, 1],
                opacity: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay1000
            })
            .add({

                targets: '#main_story3 [data="rankText4"]',
                scale: [0, 1],

                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay1000
            })
            .add({

                targets: '#main_story3 [data="numbersList4"]',
                scale: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                // delay: (el, i) => 1000 * (i + 1),
                duration: delay1000
            })
            .add({
                targets: '#main_story3 [data="numbersList4"] li',
                translateY: ['14vh', 0],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutBounce',
                // delay: (el, i) => 1000 * (i + 1),
                duration: delay1000
            })
            .add({

                targets: '#main_story3 [data="rankText1"]',
                scale: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay1000
            })
            .add({

                targets: '#main_story3 [data="numbersList1"]',
                scale: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                // delay: (el, i) => 1000 * (i + 1),
                duration: delay1000
            })
            .add({
                targets: '#main_story3 [data="numbersList1"] li',
                translateY: ['14vh', 0],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutBounce',
                // delay: (el, i) => 1000 * (i + 1),
                duration: delay1000
            })
            .add({
                targets: '#main_story3 [data="rankText2"]',
                scale: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay1000
            })
            .add({
                targets: '#main_story3 [data="numbersList2"]',
                scale: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                // delay: 2000,
                duration: delay1000
            })
            .add({
                targets: '#main_story3 [data="numbersList2"] li',
                translateY: ['14vh', 0],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutBounce',
                // delay: 2000,
                duration: delay1000
            })
            .add({

                targets: '#main_story3 [data="rankText3"]',
                scale: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay1000
            })
            .add({
                targets: '#main_story3 [data="numbersList3"]',
                scale: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                // delay: 2000,
                duration: delay1000
            })
            .add({
                targets: '#main_story3 [data="numbersList3"] li',
                translateY: ['14vh', 0],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutBounce',
                // delay: 2000,
                duration: delay1000
                //TODO: Show Final Slide 
            })
            .add({
                targets: '#main_story3',
                scale: [1, 0],
                opacity: [1, 0],
                // rotate: '1turn',
                // color: '#000',
                delay: 2000,
                easing: 'easeInOutExpo',
                duration: delay1000,
                complete: () => {
                    // $('#main_story3 [data="mainRankTitle"]').text("Hope everything will back to normal soon")
                    $('#main_story4').show();
                    startMainStory4();
                }
            })

    }


    const callD3Animation = (data) => {
        // debugger;
        $('#main_story2').empty();
        let main_story = d3.select('#main_story2');
        let w = $('#main_story2').width(),
            h = $('#main_story2').height(),
            left = w * 0.1,
            right = w * 0.1,
            top = h * 0.1,
            bottom = h * 0.1,
            innerW = w - left - right,
            innerH = h - top - bottom
            ;




        var data_message = [];
        if (data.latest_data.confirmed < 100) {
            data_message = data.timeline.reverse();
            // showTotalAndFurther(a, b, data_message, Length100);
        } else {
            data_message = data.timeline.reverse().filter(x => x.confirmed <= data.timeline.find(y => y.confirmed >= 100).confirmed);
        }

        let totalRecords = data_message.length;

        // var confirmedMin = d3.min(data_message, (a) => {
        //   return a.confirmed;
        // });
        var confirmedMax = d3.max(data_message, (a) => {
            return a.confirmed;
        });

        // Create scale
        var yScale = d3.scaleLinear()
            .domain([0, confirmedMax])
            .range([0, innerH]);

        var xScale = d3.scaleBand().range([0, innerW]).padding(0.1);
        xScale.domain(data_message.map(function (d) { return d.updated_at; }));


        // debugger;

        let svgContainer = d3.select('#main_story2')
            .append('svg')
            .attr('id', 'sample')
            .attr('width', w)
            .attr('height', h)



        let container = svgContainer.append('g')
            .attr('transform', 'translate(' + (left) + ',' + (h - bottom) + ')');

        let textContainer = svgContainer.append('g')
            .attr('transform', 'translate(' + (left) + ',' + (h - bottom) + ')');
        let callOut = textContainer.append('g');
        let callOutText = textContainer.append('g');

        let titleText = svgContainer.append('g')
            .append('text')
            .attr('x', left + innerW / 2)
            .attr('y', 40)
            .text("Let's see the daily cases reported")
            .style('fill', '#f50057')
            .style('font-size', '40px')
            .attr('opacity', 0)
            .attr('text-anchor', 'middle')
            ;
        // container.append('circle')
        //   .attr('cx', 0)
        //   .attr('cy', 0)
        //   .attr('r', 0)
        //   .transition()
        //   .duration(1000)
        //   .attr('r', 10);
        const plotBar = (dataValues, existingBars, callback) => {
            var max = dataValues[dataValues.length - 1].confirmed;
            var callbackAddressed = false;
            container.selectAll(".bar")
                .data(dataValues)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("rx", 5)
                .style("fill", (d, i) => i < data_message.length - 1 ? '#fff' : '#f50057')
                .attr("width", Math.min(xScale.bandwidth(), 10))
                // .attr("width", 0)
                .attr("height", 0)
                .attr("x", function (d) { return xScale(d.updated_at); })
                .attr("y", function (d) { return -yScale(0) + 10; })
                .transition()
                .duration(1000)
                .delay((d, i) => i <= existingBars ? 0 : (((i - existingBars) * 100 * d.confirmed / max)))
                .attr("y", function (d) { return -yScale(d.confirmed) + 10; })
                .attr("height", function (d) { return yScale(d.confirmed) + 10; })
                .on('end', (a, b) => {
                    if (container.selectAll(".bar").size() - 1 == b) {
                        callbackAddressed = true;
                        callback(a, b, dataValues)
                    }
                })

            // setTimeout(() => {
            //     if (!callbackAddressed) {
            //         callback(dataValues[dataValues.length - 1], dataValues.length, dataValues);
            //     }
            // }, container.selectAll(".bar").size()*200)


            // container.selectAll(".barSub")
            //     .data(dataValues)
            //     .enter().append("rect")
            //     .attr("class", "barSub")
            //     .attr("rx", 5)
            //     .style("fill", (d, i) => i < data_message.length - 1 ? '#ccc' : '#ccc')
            //     .attr("width", Math.min(xScale.bandwidth(), 10))
            //     // .attr("width", 0)
            //     .attr("height", 0)
            //     .attr("x", function (d) { return xScale(d.updated_at); })
            //     .attr("y", function (d) { return -yScale(0) + 10; })
            //     .transition()
            //     .duration(1000)
            //     .delay((d, i) => i <= existingBars ? 0 : ((i - existingBars) * 100))
            //     .attr("y", function (d) { return -yScale(d.new_confirmed) + 10; })
            //     .attr("height", function (d) { return yScale(d.new_confirmed) + 10; })
            //     .on('end', (a, b) => {
            //         // callback(a, b, dataValues)
            //     })
        }

        const changeBarScale = (dataValues, callback) => {
            container.selectAll(".bar")
                .attr("class", "bar")
                .transition()
                .duration(1000)
                // .transition()
                // .duration(500)
                // .attr("y", function (d) { return -yScale(d.confirmed) + 10; })
                .delay((d, i) => i * 100)
                .attr("x", function (d) { return xScale(d.updated_at); })
                .attr("y", function (d) { return -yScale(0) + 10; })
                .attr("y", function (d) { return -yScale(d.confirmed) + 10; })
                .attr("width", Math.min(xScale.bandwidth(), 10))
                .attr("height", function (d) { return yScale(d.confirmed) + 10; })
                .on('end', (a, b) => {
                    if (container.selectAll(".bar").size() - 1 == b) {
                        callback(a, b, dataValues)
                    }
                })

            // container.selectAll(".barSub")
            // .attr("class", "barSub")
            // .transition()
            // .duration(500)
            // .attr("x", function (d) { return xScale(d.updated_at); })
            // .transition()
            // .duration(500)
            // // .attr("y", function (d) { return -yScale(d.confirmed) + 10; })
            // .attr("y", function (d) { return -yScale(0) + 10; })
            // .delay((d, i) => i * 100)
            // .attr("y", function (d) { return -yScale(d.new_confirmed) + 10; })
            // .attr("width", Math.min(xScale.bandwidth(), 10))
            // .attr("height", function (d) { return yScale(d.new_confirmed) + 10; })
            // .on('end', (a, b) => {
            //     callback(a, b, dataValues)
            // })
        }

        const showNewCases = (dataValues, existingBars, callback, field = 'new_confirmed') => {
            container.selectAll(".bar")
                // .data(dataValues)
                // .enter()
                // .append("rect")
                .attr("class", "bar")
                .attr("rx", 5)
                .style("fill", (d, i) => i < dataValues.length - 1 ? '#ccc' : '#ccc')
                // .attr("width", Math.min(xScale.bandwidth(), 10))
                // .attr("width", 0)
                // .attr("height", 0)
                // .attr("x", function (d) { return xScale(d.updated_at); })
                // .attr("y", function (d) { return -yScale(0) + 10; })
                .transition()
                .duration(1000)
                .delay((d, i) => i <= existingBars ? 0 : ((i - existingBars) * 100))
                .attr("y", function (d) { return -yScale(d[field]) + 10; })
                .attr("height", function (d) { return yScale(d[field]) + 10; })
                .on('end', (a, b) => {
                    if (b == container.selectAll(".bar").size() - 1)
                        callback(a, b, dataValues)
                })
        }


        const modifyScale = (dataM) => {

            confirmedMax = d3.max(dataM, (a) => {
                return a.confirmed;
            });
            yScale.domain([0, confirmedMax]);
            xScale.domain(dataM.map(function (d) { return d.updated_at; }));
        }

        const modifyScaleDailyCases = (dataM, field = 'new_confirmed') => {

            confirmedMax = d3.max(dataM, (a) => {
                return a[field];
            });
            console.log(field, confirmedMax);
            if (confirmedMax == 0) {
                confirmedMax = d3.max(dataM, (a) => {
                    return a['new_confirmed'];
                });
            }
            yScale.domain([0, confirmedMax]);
            xScale.domain(dataM.map(function (d) { return d.updated_at; }));
        }


        function wrap(text, width) {
            // debugger;
            text.each(function () {

                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    dx = parseFloat(text.attr("dx")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y)
                        .attr("dy", dy + "em")
                        .attr("dx", dx + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", 0)
                            .attr("dx", dx + 'em')
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
                    }
                }
            });
        }

        const showCallOut = (message, data, onEnd, time = 2000, field = 'confirmed') => {
            //TODO: Show callout on top of all bar
            let barWidth = Math.min(xScale.bandwidth(), 10) / 2;

            let line_x1 = xScale(data.updated_at) + barWidth;
            let line_y1 = -yScale(data[field]) + 10;;
            let line_x2 = line_x1;
            let line_y2 = line_y1 - 300;

            let xPos = xScale(data.updated_at) + barWidth + 10;
            let yPos = line_y2;//-yScale(data.confirmed) + 10 - 300;
            let widthText = innerW * 0.6;
            // alert(Math.abs(line_y2));
            let direction = 'top';
            var line = callOut.append('line')

            if (Math.abs(line_y2) < innerH) {
                // alert('show top');

                line.attr('x1', line_x1)
                    .attr('y1', line_y1)
                    .attr('x2', line_x2)

                line.transition()
                    .duration(1000)
                    .attr('y2', line_y2)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2);

                if (line_x1 > innerW * 0.5) {
                    xPos = line_x2 - 60;
                    direction = 'top_left'
                }

            } else if (line_x1 > innerW * 0.5) {
                // alert('show left');
                line_x1 = xScale(data.updated_at) + barWidth;
                line_y1 = -yScale(data[field]) + 10;;
                line_x2 = line_x1 - widthText;
                line_y2 = line_y1;

                xPos = line_x2 - 30;
                yPos = line_y1 + 30;
                direction = 'left'

                line
                    .attr('y1', line_y1)
                    .attr('x1', line_x1)
                    .attr('y2', line_y2)
                    .attr('x2', line_x1)

                line.transition()
                    .duration(1000)
                    .attr('x2', line_x2)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2)

            } else if (Math.abs(line_y2) > innerH) {
                //show Right
                // alert('show right');

                // alert('show left');
                line_x1 = xScale(data.updated_at) + barWidth;
                line_y1 = -yScale(data[field]) + 10;;
                line_x2 = line_x1 + widthText;
                line_y2 = line_y1;

                xPos = line_x1 + 30;
                yPos = line_y1 + 30;
                direction = 'left'

                line
                    .attr('y1', line_y1)
                    .attr('x1', line_x1)
                    .attr('y2', line_y2)
                    .attr('x2', line_x1)

                line.transition()
                    .duration(1000)
                    .attr('x2', line_x2)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2)

            }







            callOutText.attr('transform', 'translate(' + xPos + ',' + yPos + ')')


            var text = callOutText.append('text')
                // .data
                .text(message)
                .attr('text-anchor', direction == 'top_left' ? 'end' : 'start')

                .attr('x', 0 + 'px')
                .attr('y', 0 + 'px')
                // .attr('x', xPos + 'px')
                // .attr('y', yPos + 'px')
                .attr('dy', 0.5)
                .attr('dx', 2)
                .style('fill', '#f50057')
                .attr('opacity', 0)
                .style('font-size', '35px')
                .attr('id', 'message')
                .attr('height', innerH * 0.5)
                .attr('width', innerW * 0.5)

            text.transition()
                .call(wrap, innerW * 0.5)
                .duration(1000)
                .attr('opacity', 1)
                .on('end', () => {
                    // debugger;
                    setTimeout(() => {
                        line.transition()
                            .duration(1000)
                            .attr(direction == 'top' ? 'y1' : 'x2', direction == 'top' ? line_y2 : line_x1)
                            .on('end', () => {
                                line.remove();
                            })
                        text.transition()
                            .duration(1000)
                            .attr('opacity', 0)
                            .on('end', () => {
                                text.remove();
                                setTimeout(() => {

                                    onEnd();
                                }, 300)
                            })
                    }, time)
                });



        }

        const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const showTotalAndFurther = (a, b, data_message, Length100) => {
            console.log('Showing All cases in this day', b);
            var message = 'Total Cases now increased to ' + a.confirmed;
            showCallOut(message, a, () => {
                //Current State
                message = 'with ' + ((a.deaths * 100 / a.confirmed).toFixed(2)) + '% mortality rate and '
                    + ((a.recovered * 100 / a.confirmed).toFixed(2)) + '% recovery rate';

                showCallOut(message, a, () => {
                    //Current State
                    modifyScaleDailyCases(data_message);
                    titleText
                        .transition()
                        .duration(300)
                        .attr('opacity', 1)
                        .on('end', () => {

                            showNewCases(data_message, Length100, (a, b, dataV) => {

                                if (true) {

                                    titleText
                                        .transition()
                                        .duration(300)
                                        .attr('opacity', 0);


                                    var maxDaily = data_message.reduce((max, p) => p.new_confirmed > max.new_confirmed ? p : max, data_message[0])


                                    // let difference = dateDiffInDays(prevDate, new Date(a.updated_at));

                                    // console.log('reached 1000 cases in this day', b);
                                    var DateText = (new Date(maxDaily.updated_at)).getDate() + ' ' + Months[(new Date(maxDaily.updated_at)).getMonth()]
                                        + ' ' + (new Date(maxDaily.updated_at)).getFullYear();
                                    message = 'On ' + DateText + ', ' + maxDaily.new_confirmed + ' Cases are reported which is a maximum number of cases reported so far in one day';

                                    showCallOut(message, maxDaily, () => {
                                        //Current State
                                        // debugger;
                                        // message = 'with ' + ((a.deaths * 100 / a.confirmed).toFixed(2)) + '% mortality rate and '
                                        //     + ((a.recovered * 100 / a.confirmed).toFixed(2)) + '% recovery rate';
                                        // hideBar();

                                        modifyScaleDailyCases(data_message, 'new_deaths');
                                        titleText
                                            .text("Let's see the mortality trend")
                                            .transition()
                                            .duration(300)
                                            .attr('opacity', 1)
                                            .on('end', () => {
                                                showNewCases(data_message, Length100, (a, b, dataV) => {
                                                    if (true) {

                                                        titleText
                                                            .transition()
                                                            .duration(300)
                                                            .attr('opacity', 0);


                                                        var maxDaily = data_message.reduce((max, p) => p.new_deaths > max.new_deaths ? p : max, data_message[0])


                                                        // let difference = dateDiffInDays(prevDate, new Date(a.updated_at));

                                                        // console.log('reached 1000 cases in this day', b);
                                                        var DateText = (new Date(maxDaily.updated_at)).getDate() + ' ' + Months[(new Date(maxDaily.updated_at)).getMonth()]
                                                            + ' ' + (new Date(maxDaily.updated_at)).getFullYear();

                                                        message = 'On ' + DateText + ', ' + maxDaily.new_deaths + ' people died which is a maximum number of deaths happened in one day';
                                                        if (maxDaily.new_deaths == 0) {
                                                            message = "So far there is no death happened. Let's pray for the death count to remain zero"
                                                            maxDaily = data_message[data_message.length - 1];
                                                        }
                                                        showCallOut(message, maxDaily, () => {
                                                            //Current State
                                                            // debugger;
                                                            // message = 'with ' + ((a.deaths * 100 / a.confirmed).toFixed(2)) + '% mortality rate and '
                                                            //     + ((a.recovered * 100 / a.confirmed).toFixed(2)) + '% recovery rate';
                                                            hideBar();
                                                        }, 5000, 'new_deaths')
                                                    }
                                                }, 'new_deaths')
                                            });



                                    }, 5000, 'new_confirmed')
                                }
                            })
                        })

                }, 5000)
            }, 5000)
        }
        const hideBar = () => {
            container.selectAll(".bar")
                .transition()
                .duration(delay800)
                .delay((d, i) => i * 20)
                .attr('y', -innerH / 2)
                .attr("height", Math.min(xScale.bandwidth(), 10))
                .on('end', (a, b) => {
                    // callback(a, b, dataValues)
                    // container.selectAll(".bar")
                    //     .transition()
                    //     .duration(1000)
                    //     .delay((d, i) => i * 20)
                    //     .attr('y', -(innerH / 2) + 20)
                    //     .transition()
                    //     .duration(1000)
                    //     .delay((d, i) => i * 20)
                    //     .attr('y', -(innerH / 2))
                    //     .on('end', (a, b) => {
                    //         // callback(a, b, dataValues)
                    //     })
                    // alert(*20+3000)
                    if (b == container.selectAll(".bar").size() - 1) {
                        container.selectAll(".bar")
                            .transition()
                            .duration(delay800)
                            .attr("height", 0)
                            .attr("width", 0)
                            .transition()
                            .on('end', (a, b) => {
                                setTimeout(() => {
                                    $('#main_story2').hide();
                                    $('#main_story3').show();
                                    startMainStory3();//TODO:disable story 3 for global

                                }, 1000)
                            })
                    }


                })
        }
        //plot first instance
        var prevDate = new Date();
        plotBar([data_message[0]], 0, (a, b, dataV) => {

            if (true) {//if (dataV.length - 1 == b) {


                var DateText = (new Date(a.updated_at)).getDate() + ' ' + Months[(new Date(a.updated_at)).getMonth()]
                    + ' ' + (new Date(a.updated_at)).getFullYear();
                prevDate = new Date(a.updated_at);
                var message = data.name + ' encountered its first COVID 19 case on ' + DateText;
                console.log('Started at so and so date', b);
                //plot till 100 cases
                showCallOut(message, a, () => {

                    plotBar(data_message, 1, (a, b, dataV) => {
                        if (true) {//if (dataV.length - 1 == b) {
                            //get 1000 cases

                            if (data.latest_data.confirmed < 100) {
                                data_message = data.timeline;

                                // changeBarScale(data_message, (a, b, dataV) => {
                                // if (true) {//if (b == 1 - 1) {
                                // plotBar(data_message, 1, (a, b, dataV) => {
                                // if (dataV.length - 1 == b) {
                                showTotalAndFurther(a, b, data_message, 1);
                                // }
                                // })
                                // }
                                // })


                                return true;
                            } else if (data_message[0].confirmed > 200) {
                                data_message = data.timeline.filter(x => x.confirmed <= data.timeline.find(y => y.confirmed >= 1000).confirmed);
                                modifyScale(data_message);

                                changeBarScale(data_message, (a, b, dataV) => {
                                    if (true) {//if (b == 1 - 1) {

                                        plotBar(data_message, 1, (a, b, dataV) => {
                                            if (true) {//if (dataV.length - 1 == b) {

                                                let difference = dateDiffInDays(prevDate, new Date(a.updated_at));
                                                console.log('reached 1000 cases in this day', b);
                                                message = 'Total cases reached 1000 in the next ' + difference + ' Days. '//It took 5 days on an average to double the infection count';// TODO: Calculate the doubling Rate
                                                showCallOut(message, a, () => {
                                                    //Current State
                                                    var Length100 = data_message.length;
                                                    data_message = data.timeline;//.filter(x => x.confirmed <= data.timeline.find(y => y.confirmed >= 1000).confirmed);
                                                    modifyScale(data_message);

                                                    changeBarScale(data_message, (a, b, dataV) => {
                                                        if (true) {//if (b == Length100 - 1) {

                                                            plotBar(data_message, Length100, (a, b, dataV) => {
                                                                if (true) {//if (dataV.length - 1 == b) {
                                                                    let difference = dateDiffInDays(prevDate, new Date(a.updated_at));

                                                                    var var_10K = data.timeline.find(y => y.confirmed >= 10000);
                                                                    if (var_10K) {
                                                                        DateText = (new Date(var_10K.updated_at)).getDate() + ' ' + Months[(new Date(var_10K.updated_at)).getMonth()]
                                                                            + ' ' + (new Date(var_10K.updated_at)).getFullYear();
                                                                        message = "crossed 10K on " + DateText;

                                                                        showCallOut(message, var_10K, () => {
                                                                            var var_10K = data.timeline.find(y => y.confirmed >= 1000000);
                                                                            if (var_10K) {
                                                                                DateText = (new Date(var_10K.updated_at)).getDate() + ' ' + Months[(new Date(var_10K.updated_at)).getMonth()]
                                                                                    + ' ' + (new Date(var_10K.updated_at)).getFullYear();
                                                                                message = "crossed 1M on " + DateText;

                                                                                showCallOut(message, var_10K, () => {
                                                                                    showTotalAndFurther(a, b, data_message, Length100);
                                                                                });
                                                                            } else {
                                                                                showTotalAndFurther(a, b, data_message, Length100);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        showTotalAndFurther(a, b, data_message, Length100);
                                                                    }

                                                                }
                                                            })

                                                        }
                                                    });
                                                }, 5000)
                                            }
                                        })

                                    }
                                });
                            }
                            else {

                                console.log('reached 100 cases in this day', b);

                                var DateText = (new Date(a.updated_at)).getDate() + ' ' + Months[(new Date(a.updated_at)).getMonth()]
                                    + ' ' + (new Date(a.updated_at)).getFullYear();

                                let difference = dateDiffInDays(prevDate, new Date(a.updated_at));
                                var message = 'The count reached 100 (' + a.confirmed + ') on ' + DateText + ' in ' + difference + ' Days';
                                prevDate = new Date(a.updated_at);
                                showCallOut(message, a, () => {

                                    var Length100 = data_message.length;

                                    if (data.latest_data.confirmed < 200) {
                                        data_message = data.timeline;
                                        modifyScale(data_message);
                                        changeBarScale(data_message, (a, b, dataV) => {
                                            if (data.latest_data.confirmed != data_message[data_message.length - 1].confirmed) {//if (b == Length100 - 1) {

                                                plotBar(data_message, Length100, (a, b, dataV) => {
                                                    if (true) {//if (dataV.length - 1 == b) {
                                                        showTotalAndFurther(a, b, data_message, Length100);
                                                    }
                                                })
                                            } else {
                                                showTotalAndFurther(a, b, data_message, Length100);
                                            }
                                        })

                                        return false;
                                    }

                                    data_message = data.timeline.filter(x => x.confirmed <= data.timeline.find(y => y.confirmed >= 200).confirmed);
                                    modifyScale(data_message);



                                    changeBarScale(data_message, (a, b, dataV) => {
                                        if (true) {//if (b == Length100 - 1) {

                                            plotBar(data_message, Length100, (a, b, dataV) => {
                                                if (true) {//if (dataV.length - 1 == b) {
                                                    let difference = dateDiffInDays(prevDate, new Date(a.updated_at));

                                                    console.log('reached 200 cases in this day', b);
                                                    message = 'the count doubled in ' + difference + ' Days';
                                                    prevDate = new Date(a.updated_at);

                                                    showCallOut(message, a, () => {


                                                        var Length100 = data_message.length;

                                                        if (data.latest_data.confirmed < 1000) {
                                                            data_message = data.timeline;
                                                            modifyScale(data_message);
                                                            changeBarScale(data_message, (a, b, dataV) => {
                                                                if (data.latest_data.confirmed != data_message[data_message.length - 1].confirmed) {//if (b == Length100 - 1) {

                                                                    plotBar(data_message, Length100, (a, b, dataV) => {
                                                                        if (true) {//if (dataV.length - 1 == b) {
                                                                            showTotalAndFurther(a, b, data_message, Length100);
                                                                        }
                                                                    })
                                                                } else {
                                                                    showTotalAndFurther(a, b, data_message, Length100);
                                                                }
                                                            })
                                                            return false;
                                                        }


                                                        data_message = data.timeline.filter(x => x.confirmed <= data.timeline.find(y => y.confirmed >= 1000).confirmed);
                                                        modifyScale(data_message);

                                                        changeBarScale(data_message, (a, b, dataV) => {
                                                            if (true) {//if (b == Length100 - 1) {

                                                                plotBar(data_message, Length100, (a, b, dataV) => {
                                                                    if (true) {//if (dataV.length - 1 == b) {

                                                                        let difference = dateDiffInDays(prevDate, new Date(a.updated_at));
                                                                        console.log('reached 1000 cases in this day', b);
                                                                        message = 'Total cases reached 1000 in the next ' + difference + ' Days. '//It took 5 days on an average to double the infection count';// TODO: Calculate the doubling Rate
                                                                        showCallOut(message, a, () => {
                                                                            //Current State
                                                                            var Length100 = data_message.length;
                                                                            data_message = data.timeline;//.filter(x => x.confirmed <= data.timeline.find(y => y.confirmed >= 1000).confirmed);
                                                                            modifyScale(data_message);

                                                                            changeBarScale(data_message, (a, b, dataV) => {
                                                                                if (true) {//if (b == Length100 - 1) {

                                                                                    plotBar(data_message, Length100, (a, b, dataV) => {
                                                                                        if (true) {//if (dataV.length - 1 == b) {
                                                                                            let difference = dateDiffInDays(prevDate, new Date(a.updated_at));

                                                                                            var var_10K = data.timeline.find(y => y.confirmed >= 10000);
                                                                                            if (var_10K) {
                                                                                                DateText = (new Date(var_10K.updated_at)).getDate() + ' ' + Months[(new Date(var_10K.updated_at)).getMonth()]
                                                                                                    + ' ' + (new Date(var_10K.updated_at)).getFullYear();
                                                                                                message = "crossed 10K on " + DateText;

                                                                                                showCallOut(message, var_10K, () => {
                                                                                                    var var_10K = data.timeline.find(y => y.confirmed >= 1000000);
                                                                                                    if (var_10K) {
                                                                                                        DateText = (new Date(var_10K.updated_at)).getDate() + ' ' + Months[(new Date(var_10K.updated_at)).getMonth()]
                                                                                                            + ' ' + (new Date(var_10K.updated_at)).getFullYear();
                                                                                                        message = "crossed 1M on " + DateText;

                                                                                                        showCallOut(message, var_10K, () => {
                                                                                                            showTotalAndFurther(a, b, data_message, Length100);
                                                                                                        });
                                                                                                    } else {
                                                                                                        showTotalAndFurther(a, b, data_message, Length100);
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                showTotalAndFurther(a, b, data_message, Length100);
                                                                                            }

                                                                                        }
                                                                                    })

                                                                                }
                                                                            });
                                                                        }, 5000)
                                                                    }
                                                                })

                                                            }
                                                        });

                                                    })
                                                }
                                            })

                                        }
                                    });
                                });
                                //end
                            }
                        }

                    });
                })
            }
        });






    }

    const startStory = (values, data) => {
        document.body.style.overflow = 'hidden';

        //Start of total Cases Animation
        // Wrap every letter in a span
        let index = 0;


        function animateNumbers(index) {

            //debugger;
            var totalNumber = values[index];
            // var totalNumberIncrement = totalNumber / 2000 / 100;
            var startValue = 0
            var textWrapper = document.querySelector('.story_numbers[data="' + index + '"] [data="story_total"]');
            textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
            var translateTop = 0;//-$('.story_heading').height() / 2;

            anime.timeline({ loop: false })
                .add({
                    targets: '.story_numbers[data="' + index + '"] [data="story_total"]',
                    opacity: [0, 1]
                })
                .add({
                    targets: '.story_numbers[data="' + index + '"] [data="story_total"] .letter',
                    translateY: ["1.1em", 0],
                    translateX: ["0.55em", 0],
                    translateZ: 0,
                    opacity: [0, 1],
                    rotateZ: [180, 0],
                    duration: delay750,
                    easing: "easeOutExpo",
                    delay: (el, i) => delay50 * i
                })
                .add({
                    targets: '.story_numbers[data="' + index + '"] [data="story_total"]',
                    translateY: [0, translateTop],
                    easing: "easeOutExpo",
                    duration: 0, //comment this in prod
                })
                .add({
                    targets: '.story_numbers[data="' + index + '"] [data="story_total_number"]',
                    opacity: [0, 1],
                    translateY: [0, translateTop],
                    duration: delay750,
                    easing: "easeOutExpo",
                    update: function (anim) {
                        startValue = totalNumber * anim.progress / 100;
                        // progressLogEl.value = 'progress : '+Math.round(anim.progress)+'%';
                        // updateLogEl.value = 'updates : '+updates;
                        $('.story_numbers[data="' + index + '"] [data="story_total_number"]').text(Math.round(startValue));
                    },
                    complete: () => {
                        anime.timeline({ loop: false })
                            .add({
                                targets: '.story_numbers[data="' + index + '"] [data="story_total_progress"]',
                                scaleX: [0, 0],
                                translateY: [0, translateTop],
                                duration: delay300,
                                easing: "easeOutExpo"
                            })
                            .add({
                                targets: '.story_numbers[data="' + index + '"] [data="story_total_progress"]',
                                scaleX: [0, values[index] / values[0]],
                                duration: delay1000,
                                delay: delay300,
                                easing: "easeOutExpo",
                                complete: () => {

                                    anime.timeline({ loop: false })
                                        .add({
                                            targets: '.story_numbers[data="' + index + '"] [data="story_percent"]',
                                            opacity: [0, 1],
                                            translateX: [200, 0],
                                            duration: delay300,
                                            easing: "easeOutExpo",
                                            complete: () => {
                                                if (index < 3) {
                                                    index += 1;
                                                    animateNumbers(index);
                                                } else {
                                                    $('#main_story2 [data="0"], #main_story2 [data="1"], #main_story2 [data="2"], #main_story2 [data="3"]').css('opacity', 1)
                                                    setTimeout(() => {
                                                        closeSummary();
                                                    }, delay2000)
                                                }
                                            }
                                        })


                                }
                            })
                    }
                });
        }

        const closeSummary = () => {
            anime.timeline({ loop: false })
                .add({
                    targets: '#main_story2 [data="line1"], #main_story2 [data="line2"]',
                    scaleX: [0, 0.8],
                    opacity: [0, 1],
                    translateY: 0,
                    // rotate: '1turn',
                    // color: '#000',
                    easing: 'easeInOutExpo',
                    duration: delay800
                })
                // .add({
                //   targets: '#main_story2 [data="line2"]',
                //   scaleX: [0, 0.8],
                //   opacity: [0, 1],
                //   // rotate: '1turn',
                //   // color: '#000',
                //   easing: 'easeInOutExpo',
                //   duration: 800,
                //   delay: -800
                // })
                // anime.timeline({ loop: false })
                .add({
                    targets: '#main_story2 [data="line1"], #main_story2 [data="0"], #main_story2 [data="1"],#main_story2 [data="line2"], #main_story2 [data="2"], #main_story2 [data="3"]',
                    translateY: (a, b) => {
                        // return b==0?[0, -$('#main_story2').height() / 2 + 10]:[0, $('#main_story2').height() / 2 - 10]
                        return b <= 2 ? [0, -1000] : [0, 1000]
                    },
                    // rotate: '1turn',
                    // color: '#000',
                    easing: 'easeInOutExpo',
                    duration: delay800,
                    complete: () => {
                        callD3Animation(data);
                    }
                })



        }




        anime.timeline({ loop: false })
            .add({
                targets: '#story_title',
                scale: [100, 1],
                opacity: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay800
            }).add({
                targets: '#story_subtitle',
                scale: [100, 1],
                opacity: [0, 1],
                // rotate: '1turn',
                // color: '#000',
                easing: 'easeInOutExpo',
                duration: delay800,
                complete: () => {
                    setTimeout(() => {
                        anime.timeline({ loop: false })
                            .add({
                                targets: '#story_title',
                                scale: [1, 100],
                                opacity: [1, 0],
                                // rotate: '1turn',
                                // color: '#000',
                                easing: 'easeInOutExpo',
                                duration: delay800
                            }).add({
                                targets: '#story_subtitle',
                                scale: [1, 100],
                                opacity: [1, 0],
                                // rotate: '1turn',
                                // color: '#000',
                                easing: 'easeInOutExpo',
                                duration: delay800,
                                complete: () => {
                                    //callD3Animation();
                                    $('#main_story2').show();
                                    if (testing) {
                                        callD3Animation(data)

                                    } else {

                                        animateNumbers(index);
                                    }

                                    // anime.timeline({ loop: false })
                                    //   .add({
                                    //     targets: '#circle',
                                    //     scale: [0, 5],
                                    //     // rotate: '1turn',
                                    //     // color: '#000',
                                    //     easing: 'easeInOutExpo',
                                    //     duration: 100
                                    //   }).add({
                                    //     targets: '#circle',
                                    //     scale: [5, 1],
                                    //     // rotate: '1turn',
                                    //     // color: '#000',
                                    //     easing: 'easeInOutExpo',
                                    //     duration: 300
                                    //   })




                                }
                            });
                    }, delay2000)

                }
            });

        // alert("assa");
    }




    const handleClickOpen = () => {
        setOpenDesclaimer(true);

        // setTimeout(function(){
        //   startStory();
        // }, 3000)
    };

    const handleClose = () => {
        setOpen(false);
    };



    function getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    function XandY(elem) {

        if (helpNumber == 6 || helpNumber == 7 || (helpNumber >= 9 && helpNumber <= 13)) {

            $('html, body').animate({ scrollTop: 0 }, 0);
            // Y = 0 - border/2 - scaledWidth_I/2;
        }

        var pos = getCoords(elem[0]);
        var posHighlight = getCoords($(".highlighter")[0]);
        var element = document.querySelector('#lens');
        var scaleX = element.getBoundingClientRect().width / element.offsetWidth;


        var highlightHeight = document.getElementById('lens').offsetHeight;
        var highlightWidth = document.getElementById('lens').offsetWidth;
        var highlightHeight_I = $('#lens').height();
        var highlightWidth_I = $('#lens').width();;

        var Y = (pos.top + elem.outerHeight() / 2) - (highlightHeight / 2) - 64;


        var X = (pos.left + elem.outerWidth() / 2) - (highlightWidth / 2);
        var S = Math.max(1, elem.outerWidth() / $('#lens').width());

        var scaledWidth = S * highlightWidth;
        var scaledWidth_I = S * highlightWidth_I;
        var scaledHeight = S * highlightHeight;
        var scaledHeight_I = S * highlightHeight_I;
        var border = scaledWidth - scaledWidth_I;
        var textWidth = border / 2 - 20 - 20;
        // debugger;
        var X_SCALED = (pos.left + elem.outerWidth() / 2) - (scaledWidth / 2);
        var Y_SCALED = (pos.top + elem.outerHeight() / 2) - (scaledHeight / 2);


        var textLeftX = X_SCALED + 20;
        var textLeftY = Y_SCALED + (scaledHeight / 2) - 64;

        var textBottomX = X_SCALED + scaledWidth / 2 - textWidth;
        var textBottomY = Y_SCALED + (scaledHeight / 2) + scaledHeight_I / 2;
        // alert([X_SCALED,scaledWidth, X_SCALED+scaledWidth])
        // var textRightX = X_SCALED + scaledWidth - (border / 4) - (border / 2) + 10;
        var textRightX = X_SCALED + border / 2 + scaledWidth_I + 10;
        var textRightY = Y_SCALED + (scaledHeight / 2) - 64;

        var textTopX = 0;
        var textTopY = 0;

        var textY = 0;
        var textX = 0;
        // debugger;


        // if (x <= border) {
        //     textX = textBottomX;
        //     textY = textBottomY;
        // } else 
        // ((X_SCALED + border/2) > border)
        // debugger;
        // if (((textRightX + textWidth) < (window.innerWidth) || textLeftX < 0 )) {//if (X_SCALED < border) {
        //     textX = textRightX;
        //     textY = textRightY;
        //     if ((textWidth + textRightX) > window.innerWidth) {
        //         textWidth = window.innerWidth - textRightX;
        //     }
        // } else {
        //     textX = textLeftX;
        //     textY = textLeftY;



        // }




        var direction = 'left';

        if (X_SCALED > 0) {

            direction = 'left';
            textX = textLeftX;
            textY = textLeftY;

        } else if (X_SCALED < 0 && (X_SCALED + scaledWidth) < window.innerWidth) {

            direction = 'right';
            textX = textRightX;
            textY = textRightY;

        } else if (Y_SCALED < 0) {
            direction = 'bottom';
            textWidth = scaledWidth_I;
            textX = X_SCALED + border / 2;
            textY = Y_SCALED + border / 2 + scaledWidth_I;

        } else {
            direction = 'top';
        }





        // if ((X_SCALED + border / 4) > 0) {
        //     // left
        //     var remaining_space_in_visibleArea =
        //         textX = X_SCALED + (border / 2) - 10 - (remaining_space_in_visibleArea)
        // } else if ((X_SCALED + scaledWidth - border / 4) < window.innerWidth) {
        //     //right
        // } else if ((Y_SCALED + border / 2) < 0) {
        //     // bottom
        // } else {
        //     //top
        // }


        // if ((border / 2) <= border) {
        // if (x <= border) {
        //     textX = textBottomX;
        //     textY = textBottomY;
        // } else if (X_SCALED > 0) {
        //     textX = textLeftX;
        //     textY = textLeftY;
        // } else if (X_SCALED < 0) {
        //     textX = textRightX;
        //     textY = textRightY;
        // }

        // alert([textX, textY])


        return {
            X: X,
            Y: Y,
            S: S,
            textX: textX,
            textY: textY,
            width: textWidth,
            text: direction
        }
    }



    useEffect(() => {

        setCountry_name_input(props.selectedCountry[1]);

        var rankConfirm = (props.mapData
            .filter(x => x.data && x.data.confirmed)
            .sort((x, y) => {
                // console.log('akk', x.id);
                return x.data.confirmed > y.data.confirmed ? -1 : 1
            })
            .map(x => x.id).indexOf(props.selectedCountry[1])) + 1;

        var rankDeath = (props.mapData
            .filter(x => x.data && x.data.deaths)
            .sort((x, y) => x.data.deaths / x.data.confirmed > y.data.deaths / y.data.confirmed ? -1 : 1)
            .map(x => x.id).indexOf(props.selectedCountry[1])) + 1;

        var rankRecovery = (props.mapData
            .filter(x => x.data && x.data.recovered)
            .sort((x, y) => x.data.recovered / x.data.confirmed > y.data.recovered / y.data.confirmed ? -1 : 1)
            .map(x => x.id).indexOf(props.selectedCountry[1])) + 1;

        var rankPopulation = (props.mapData
            .filter(x => x.population)
            .sort((x, y) => x.population > y.population ? -1 : 1)
            .map(x => x.id).indexOf(props.selectedCountry[1])) + 1;


        setRankByConfirmed([rankConfirm, rankRecovery, rankDeath, rankPopulation]);

    }, [props.selectedCountry]);

    // useEffect(() => {
    //     // debugger;
    //     // var rankConfirm = (props.mapData
    //     //     .sort((x, y) => x.data.confirmed > y.data.confirmed ? -1 : 1)
    //     //     .map(x => x.id).indexOf(country_name_input)) + 1;

    //     // var rankDeath = (props.mapData
    //     //     .sort((x, y) => x.data.deaths > y.data.deaths ? -1 : 1)
    //     //     .map(x => x.id).indexOf(country_name_input)) + 1;

    //     // var rankRecovery = (props.mapData
    //     //     .sort((x, y) => x.data.recovered > y.data.recovered ? -1 : 1)
    //     //     .map(x => x.id).indexOf(country_name_input)) + 1;


    //     // setRankByConfirmed([rankConfirm, rankRecovery, rankDeath]);
    // }, [props.mapData]);

    const [openSnackBar, setOpenSnackBar] = useState(false);
    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const [stateSnack, setStateSnack] = React.useState({
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal } = stateSnack;

    // const snackTransition =  function(props, ref) {
    //     return <Slide direction="up" ref={ref} {...props} />;
    // }
    const [helpNumber, setHelpNumber] = useState(0);
    const helpTexts = [
        {
            id: 0,
            message: "Cards at the top shows the New Cases, Total Cases, Total Recovered and Total Deaths happened so far.",
            selector: '[help="card_0"]'
        },
        {
            id: 1,
            message: "The number after the arrow shows the variance. The arrow indicates whether the count has increased or decreased.",
            selector: '[help="variance"]'
        },
        {
            id: 2,
            message: "Click on the 'Total' button to see the variance based on the total count",
            selector: '[help="total"]'
        },
        {
            id: 3,
            message: "Click on the 'Previous Day' button to see the variance based on the previous day count",
            selector: '[help="yesterday"]'
        },
        {
            id: 4,
            message: "Click on the switch to toggle between variance percentage or variance number",
            selector: '[help="variance_number"]'
        },
        {
            id: 5,
            message: "Select a country in the map to filter the data. Click on the country again to deselect.",
            selector: '[help="map"]'
        },
        {
            id: 6,
            message: "Click on the play button to view animated view of the analysis. This option gets enabled only if a country is selected",
            selector: '[help="play"]'
        },
        {
            id: 7,
            message: "You can also access the country filter from this menu. Click on the country again to deselect.",
            selector: '[help="filter"]'
        },
        {
            id: 8,
            message: "Use the slider to view the trend for a specific period",
            selector: '[help="line"]'
        },
        {
            id: 9,
            message: "Click on these button to open Code Loop's Youtube Page",
            selector: '[help="youtube"]'
        },
        {
            id: 10,
            message: "Click on these button to open Code Loop's Facebook Page",
            selector: '[help="facebook"]'
        },
        {
            id: 11,
            message: "Click on these button to open Code Loop's Twitter Page",
            selector: '[help="twitter"]'
        },

        {
            id: 12,
            message: "Click here to access the help button again",
            selector: '[help="help"]'
        },
        {
            id: 13,
            message: "Share this page with your friends if you like it.",
            selector: '#st-2'
        }
    ]
    const [openHelp, setOpenHelp] = React.useState(false);
    const [openDesclaimer, setOpenDesclaimer] = React.useState(false);
    const [openWarning, setOpenWarning] = React.useState(false);
    const showHelp = (increment) => {



        setOpenHelp(false);
        if (helpNumber == 14) {
            anime({
                targets: ".highlighter",
                // opacity: [0, 1],
                translateY: 0,
                translateX: 0,
                scale: 0,
                easing: "linear",
                duration: 700,
            });

            anime({
                targets: ".highlighterText",
                opacity: [1, 0],
                scale: [1, 0],
                // translateY: "0px",
                // translateX: "0px",
                translateY: 0,//+$('.highlighterText').height(),
                translateX: 0,
                easing: "linear",
                duration: 700,
                complete: () => {
                    setHelpNumber(0);
                }
            })
        } else {

            let selected = helpTexts[helpNumber];
            $('.highlighterText .message').text(selected.message);
            // $('.highlighterText').css('width', ');
            var POS = XandY($(selected.selector));
            $('.highlighterText').css('width', POS.width + 'px');



            anime({
                targets: ".highlighter",
                // opacity: [0, 1],
                translateY: POS.Y,
                translateX: POS.X,
                scale: POS.S,
                easing: "linear",
                duration: 700,
                // offset: "-=700",
                complete: function (anim) {
                    // completeLogEl.value = 'completed : ' + anim.completed;
                    // $('.carousel').carousel('next')
                    // alert(POS.text);
                }
            });


            anime({
                targets: ".highlighterText",
                opacity: [0, 1],
                scale: [0, 1],
                // translateY: "0px",
                // translateX: "0px",
                translateY: POS.textY,//+$('.highlighterText').height(),
                translateX: POS.textX,
                easing: "linear",
                duration: 700,
                complete: function (anim) {
                    // completeLogEl.value = 'completed : ' + anim.completed;
                    // $('.carousel').carousel('next')


                    setHelpNumber(helpNumber + 1);


                    if (helpNumber == 2) {
                        props.selectFormat("yesterday");
                    } else if (helpNumber == 5) {
                        props.selectCountry(["India", "IN"]);
                    }

                }
            })
        }

    }


    const showPrevHelp = (increment) => {



        setOpenHelp(false);
        if (helpNumber == 14) {
            anime({
                targets: ".highlighter",
                // opacity: [0, 1],
                translateY: 0,
                translateX: 0,
                scale: 0,
                easing: "linear",
                duration: 700,
            });

            anime({
                targets: ".highlighterText",
                opacity: [1, 0],
                scale: [1, 0],
                // translateY: "0px",
                // translateX: "0px",
                translateY: 0,//+$('.highlighterText').height(),
                translateX: 0,
                easing: "linear",
                duration: 700,
                complete: () => {
                    setHelpNumber(0);
                }
            })
        } else {

            let selected = helpTexts[helpNumber - 2];
            $('.highlighterText .message').text(selected.message);
            // $('.highlighterText').css('width', ');
            var POS = XandY($(selected.selector));
            $('.highlighterText').css('width', POS.width + 'px');



            anime({
                targets: ".highlighter",
                // opacity: [0, 1],
                translateY: POS.Y,
                translateX: POS.X,
                scale: POS.S,
                easing: "linear",
                duration: 700,
                // offset: "-=700",
                complete: function (anim) {
                    // completeLogEl.value = 'completed : ' + anim.completed;
                    // $('.carousel').carousel('next')
                    // alert(POS.text);
                }
            });


            anime({
                targets: ".highlighterText",
                opacity: [0, 1],
                scale: [0, 1],
                // translateY: "0px",
                // translateX: "0px",
                translateY: POS.textY,//+$('.highlighterText').height(),
                translateX: POS.textX,
                easing: "linear",
                duration: 700,
                complete: function (anim) {
                    // completeLogEl.value = 'completed : ' + anim.completed;
                    // $('.carousel').carousel('next')


                    setHelpNumber(helpNumber - 1);


                    if (helpNumber == 2) {
                        props.selectFormat("yesterday");
                    } else if (helpNumber == 5) {
                        props.selectCountry(["India", "IN"]);
                    }

                }
            })
        }

    }


    const closeHelp = (increment) => {
        anime({
            targets: ".highlighter",
            // opacity: [0, 1],
            translateY: 0,
            translateX: 0,
            scale: 0,
            easing: "linear",
            duration: 700,
        });

        anime({
            targets: ".highlighterText",
            opacity: [1, 0],
            scale: [1, 0],
            // translateY: "0px",
            // translateX: "0px",
            translateY: 0,//+$('.highlighterText').height(),
            translateX: 0,
            easing: "linear",
            duration: 700,
            complete: () => {
                setHelpNumber(0);
            }
        })
    }

    const handleHelpClose = () => {
        setOpenHelp(false);
        setOpenSnackBar(true);
    };

    const handleHelpClose_DoNotShow = () => {
        localStorage.setItem('showHelp', 'false');
        setOpenHelp(false);
        setOpenSnackBar(true);
    };

    const handleDesclaimerClose = () => {
        setOpenDesclaimer(false);
        setOpen(true);
    };

    const handleWarningClose = () => {
        setOpenWarning(false);
        setOpenHelp(true);
    };
    const goToPrev = () => {
        setHelpNumber(helpNumber - 2);
        setTimeout(() => {
            showHelp();
        }, 1000)


    }


    useEffect(() => {

        if (localStorage.getItem('showHelp') == undefined || localStorage.getItem('showHelp') == 'true') {
            setHelpNumber(0);
            if(window.innerWidth<768){
                setOpenWarning(true);
            }else{
                setOpenHelp(true);

            }


        }

    }, []);
    return (

        <div className={classes.root}>

            <div className="highlighter position-absolute" id="lens"></div>

            <div className="highlighterText position-absolute" id='lensText'>
                <span className="message">Click here to view the Navigation Links</span>
                <div>
                    {helpNumber > 1 ? <Chip onClick={showPrevHelp} label="Prev" /> : ''}&nbsp;&nbsp;
                    <Chip onClick={showHelp} label="Next" />&nbsp;&nbsp;
                    <Chip onClick={closeHelp} label="Close" />&nbsp;&nbsp;
                </div>
            </div>
            <Dialog
                open={openHelp}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleHelpClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Do you need a help?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Looks like this is the first time you are accessing the dashboard. Do you want to see the intractive demo of the dashboard
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={showHelp} color="primary">
                        Yes
                    </Button>
                    <Button onClick={handleHelpClose} color="primary">
                        Not Now
                    </Button>
                    <Button onClick={handleHelpClose_DoNotShow} color="primary">
                        Do Not Show Again
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDesclaimer}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDesclaimerClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Data Source"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        The dashboard has been built using React and the source for the dashboard optained from below website.
                        <br></br>
                        <br></br>
                        <Typography>
                            <Link href="https://about-corona.net/">https://about-corona.net/</Link>
                        </Typography><br></br>

                        So there might be some data descrepency which I have no control. <br></br>I have built this dashboard for 'React' training purpose. <br></br>
                        <br></br>

                        Click 'OK' to continue.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDesclaimerClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openWarning}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleWarningClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Small Screen Notification</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        This dashboard is created for desktop resolution. Some features might not work in mobile devices or smaller screen devices. Instead watch the youtube videos using the below link,
                        <br></br>
                        <br></br>
                        <Typography>
                            <Link href="https://www.youtube.com/watch?v=KReMvVe-SZc&list=PLch--af-pl10YGMkmB_lzSwkxnOqivN4E">Youtube</Link>
                        </Typography><br></br>

                        
                        <br></br>

                        Click 'OK' to continue.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleWarningClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton help="filter" onClick={toggleDrawer(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        COVID-19
            </Typography>


                    {country_name_input != '' ?
                        <Box display={{ xs: 'none', sm: 'none', md: 'block', lg: 'block' }} component="p" m={1}>
                            <Fab help="play" onClick={handleClickOpen} color="secondary" aria-label="add" className={classes.fabButton}>
                                <PlayArrowIcon />
                            </Fab>
                        </Box> : ''
                    }

                    {country_name_input != '' ?
                        <Box display={{ xs: 'block', sm: 'block', md: 'none', lg: 'none' }} component="p" m={1}>
                            <Fab help="play" onClick={handleClickOpen} color="secondary" aria-label="add" className={classes.fabButtonMobile}>
                                <PlayArrowIcon />
                            </Fab>
                        </Box> : ''

                    }

                    {/* <Button color="inherit">Help</Button> */}
                    <a href="https://www.youtube.com/channel/UCVU2z6rYyOqBT81Ts_L-jdg">
                        <MenuItem help="youtube">

                            <IconButton aria-label="youtube" color="inherit">
                                <YouTubeIcon />
                            </IconButton>
                            <Box display={{ xs: 'none', sm: 'block' }} component="p" m={1}>
                                Youtube
                            </Box>

                        </MenuItem>
                    </a>
                    <a href="https://www.facebook.com/Code-Loop-101824191476026/">
                        <MenuItem help="facebook">
                            <IconButton aria-label="youtube" color="inherit">
                                <FacebookIcon />
                            </IconButton>
                            <Box display={{ xs: 'none', sm: 'block' }} component="p" m={1}>
                                Facebook
                            </Box>
                        </MenuItem>
                    </a>
                    <a href="https://twitter.com/CodeLoopTech">
                        <MenuItem help="twitter">
                            <IconButton aria-label="youtube" color="inherit">
                                <TwitterIcon />
                            </IconButton>
                            <Box display={{ xs: 'none', sm: 'block' }} component="p" m={1}>
                                Twitter
                            </Box>
                        </MenuItem>
                    </a>

                    <MenuItem help="help" onClick={showHelp}>
                        <IconButton aria-label="youtube" color="inherit">
                            <HelpIcon />
                        </IconButton>
                    </MenuItem>




                </Toolbar>
            </AppBar>
            {/* <React.Fragment> */}
            <SwipeableDrawer
                anchor="left"
                open={drawer}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <div>
                    <List>
                        {props.mapData.filter(x => x.name && x.name.length > 0)
                            .sort((x, y) => x.name > y.name ? 1 : -1).map((country, index) => (
                                country.id != 'AQ' && country.data ? (<ListItem onClick={() => {
                                    if (props.selectedCountry[1] == country.id) {

                                        props.selectCountry(['', '']);
                                    } else {

                                        props.selectCountry([country.name, country.id]);
                                    }
                                    drawerState(false);
                                }
                                } button key={country.id}>
                                    {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                                    <img src={"https://www.countryflags.io/" + country.id.toString().toLowerCase() + "/shiny/48.png"}></img>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <ListItemText data={country.name} primary={country.name} />
                                </ListItem>) : ''
                            ))}
                    </List>
                </div>
            </SwipeableDrawer>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openSnackBar}
                autoHideDuration={10000}
                onClose={handleCloseSnack}
            // TransitionComponent={snackTransition}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    This Dashboard is created by Code Loop. Please share it with your friends if you like it. Click on the button on the navigation panel to open the social media pages of Code Loop
                </Alert>
            </Snackbar>
            {/* </React.Fragment> */}
            <div>
                {/* <ThemeProvider theme={theme}> */}
                <Dialog onEntered={getDataForCountry} fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {countryName}
                            </Typography>
                            {/* <Button autoFocus color="inherit" onClick={handleClose}>
                                share
                            </Button> */}
                        </Toolbar>
                    </AppBar>
                    <div id="main_story" className={classes.story}>
                        <div className="story_heading">
                            <h1 id="story_title" className={classes.story_title}>
                                Welcome to COVID-19 Data Analysis
            </h1>
                            <h2 id="story_subtitle" className={classes.story_subtitle}>
                                by Code Loop
            </h2>
                            <span id="circle" className={classes.circle}></span>
                        </div>
                    </div>
                    <div id="main_story2" className={classes.story}>
                        <div data="0" className="story_numbers">
                            <Grid container spacing={3}>
                                <Grid item xs={3} md={3} sm={3} className={classes.percent} data="story_percent">
                                    {(values[0] * 100 / values[0]).toFixed(0)} %
                                </Grid>
                                <Grid item xs={9} md={9} sm={9}>
                                    <h2 data="story_total" className={classes.story_numbers}>
                                        Total Cases
                  </h2>
                                    <h2 total="4109549" data="story_total_number" className={classes.story_numbers_value}>
                                        4,109,549
                  </h2>
                                    <span data="story_total_progress" className={classes.progress}></span>
                                </Grid>
                            </Grid>

                        </div>
                        <div data="1" className="story_numbers">
                            <Grid container spacing={3}>
                                <Grid item xs={3} md={3} sm={3} className={classes.percent} data="story_percent">
                                    {(values[1] * 100 / values[0]).toFixed(0)} %
                </Grid>
                                <Grid item xs={9} md={9} sm={9}>
                                    <h2 data="story_total" className={classes.story_numbers}>
                                        Recovered
              </h2>
                                    <h2 total="1447529" data="story_total_number" className={classes.story_numbers_value}>
                                        1,447,529
              </h2>
                                    <span data="story_total_progress" className={classes.progress}></span>
                                </Grid>
                            </Grid>
                        </div>
                        <span data="line1" className={classes.line}></span>
                        <span data="line2" className={classes.line}></span>
                        <div data="2" className="story_numbers">
                            <Grid container spacing={3}>
                                <Grid item xs={3} md={3} sm={3} className={classes.percent} data="story_percent">
                                    {(values[2] * 100 / values[0]).toFixed(0)} %
                </Grid>
                                <Grid item xs={9} md={9} sm={9}>
                                    <h2 data="story_total" className={classes.story_numbers}>
                                        Deaths
              </h2>
                                    <h2 total="1447529" data="story_total_number" className={classes.story_numbers_value}>
                                        1,447,529
              </h2>
                                    <span data="story_total_progress" className={classes.progress}></span>
                                </Grid>
                            </Grid>
                        </div>

                        <div data="3" className="story_numbers">
                            <Grid container spacing={3}>
                                <Grid item xs={3} md={3} sm={3} className={classes.percent} data="story_percent">
                                    {(values[3] * 100 / values[0]).toFixed(0)} %
                                </Grid>
                                <Grid item xs={9} md={9} sm={9}>
                                    <h2 data="story_total" className={classes.story_numbers}>
                                        Active Cases
                                    </h2>
                                    <h2 total="1447529" data="story_total_number" className={classes.story_numbers_value}>
                                        1447529
                                    </h2>
                                    <span data="story_total_progress" className={classes.progress}></span>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div id="main_story3" className={classes.story}>
                        <Grid container spacing={3}>

                            <Grid item xs={12} md={12} sm={12}>
                                <Typography style={{ opacity: 0 }} variant="h2" component="h2" gutterBottom data="mainRankTitle">
                                    {countryName}'s Rank in the world
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={3} md={3} sm={3}>
                                <Typography variant="h3" component="h3" gutterBottom>
                                    <ul className={classes.numbersList} data="numbersList4">
                                        <li className={classes.numbers}>{rankByConfirmed[3]}</li>
                                    </ul>
                                </Typography>
                                <Typography variant="h4" component="h3" gutterBottom data="rankText4" className={classes.rankText}>
                                    In Population
                                </Typography>
                            </Grid>

                            <Grid item xs={3} md={3} sm={3}>

                                <Typography variant="h3" component="h3" gutterBottom>
                                    <ul className={classes.numbersList} data="numbersList1">
                                        <li className={classes.numbers}>{rankByConfirmed[0]}</li>
                                    </ul>
                                </Typography>
                                <Typography variant="h4" component="h3" gutterBottom data="rankText1" className={classes.rankText}>
                                    In Total Cases
                            </Typography>



                            </Grid>

                            <Grid item xs={3} md={3} sm={3}>
                                <Typography variant="h3" component="h3" gutterBottom>
                                    <ul className={classes.numbersList} data="numbersList2">
                                        <li className={classes.numbers}>{rankByConfirmed[1]}</li>
                                    </ul>
                                </Typography>
                                <Typography variant="h4" component="h3" gutterBottom data="rankText2" className={classes.rankText}>
                                    In Recovery Rate
                                </Typography>
                            </Grid>

                            <Grid item xs={3} md={3} sm={3}>
                                <Typography variant="h3" component="h3" gutterBottom>
                                    <ul className={classes.numbersList} data="numbersList3">
                                        <li className={classes.numbers}>{rankByConfirmed[2]}</li>
                                    </ul>
                                </Typography>
                                <Typography variant="h4" component="h3" gutterBottom data="rankText3" className={classes.rankText}>
                                    In Mortality Rate
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>

                    <div id="main_story4" className={classes.story}>
                        <Grid container spacing={3}>

                            <Grid item xs={12} md={12} sm={12}>
                                <Typography style={{ opacity: 0 }} variant="h2" component="h2" gutterBottom data="mainRankTitle">
                                    Like My Work?
                                </Typography>
                                <Typography style={{ opacity: 0 }} variant="h3" component="h3" gutterBottom data="mainRankTitle">
                                    Please subscribe to my youtube channel CodeLoop
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} sm={12}>
                                <Typography variant="h3" component="h3" gutterBottom>
                                    <ul className={classes.numbersList} data="numbersList4">
                                        <li className={classes.numbers}>{rankByConfirmed[3]}</li>
                                    </ul>
                                </Typography>

                                <a href="https://www.youtube.com/channel/UCVU2z6rYyOqBT81Ts_L-jdg"><h1 className="ml8">
                                    <span className="letters-container">
                                        <span className="letters letters-left">
                                            <img src={logo} alt="Logo" style={{ width: '138px' }} />
                                        </span>
                                        <span className="letters bang"></span>

                                    </span>
                                    <span className="circle circle-white"></span>
                                    <span className="circle circle-dark"></span>
                                    <span className="circle circle-container"><span className="circle circle-dark-dashed"></span></span>
                                </h1>
                                </a>

                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>

                            <Grid item xs={12} md={12} sm={12}>
                                <Typography style={{ opacity: 0 }} variant="h4" component="h4" gutterBottom data="mainRankTitle2">
                                    Access the dashboard using the link provided in the description
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                </Dialog>
                {/* </ThemeProvider> */}
            </div >

        </div >
    );
}

export default NavBar;
