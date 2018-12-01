
// let's get our constants down
w = 2000;     // Width of our visualization
h = 1000;      // Height of our visualization
lineSpacing = 125; //spacing between y axis 
margin = 125; // margin defining max and min values and the height of axis
xmargin = 50;//x space between svg box and start of the parallel coordinates plot
axisSpacing = 200; //spacing between axis
legendY = h/3+margin; // general y location of legend
legendX = 0;// general x location of legend
categoryStart = 3; // determines the attribute in csv file that we wish to start our plot with
room4Improvement = {}// array with available points in a ranking category
//below is an array of all possible available points for desired categories
maxPoints= [38.06,	20.3,	18.27,	20.3,	12.69,	10.05,	9.14,	9.59,	10.05,	7.31,	6,	8.12,	9.14,	5.08,	4.57,	4.06,	3.05,	2.74,	4]


//open csv
d3.csv("/s/2018CoolSchools_SierraClub.csv", function(csvData) {
	data = csvData; 
	attributes = d3.keys(data[0]); //list of all attributes
	var xCoord = xmargin; // x position for a given axis


	// scale to spread out two initially close numbers
	zScale = d3.scalePow()
				.domain([1,3])
				.range([1,100])
				

    // scale to convert number to categorical color
    var color = d3.scale.category10()
    				.domain(1,300)
  
    	
    //scale to convert number to sequential color
   	color2 = d3.scale.linear()
        .domain([0,100])
        .range(colorbrewer.OrRd[3])
        .interpolate(d3.interpolateLab);



	// we create our svg container
	svg = d3.select('#pointsSVG').append('svg:svg')
        .attr('width', w)
        .attr('height', h);

    // below add most of necessary text
    svg.append('text')
      .attr("x", legendX)
      .attr("y", legendY-5)
      .attr('font-weight', 'bold')
      .text('ColorCode, Ranking, College');

     svg.append('text')
      .style("font-size", "25px")
      .attr("x", legendX*10)
      .attr("y", 20)
      .attr('font-weight', 'bold')
      .text('Sierra Club Sustainability Rankings for Higher Ed');

     svg.append('text')
      .attr("x", legendX*13)
      .attr("y", 35)
      .attr('font-weight', 'bold')
      .text('by Alejandro Gallardo');


	// function that determines y axis scale depending on given attribute
	// input: attribte (name of column of csv)
	function yScaleFunction(attribute,i){
		if (i==0){
		  	yScale = d3.scale.linear()
	          .domain([d3.min(data, function(d) {return parseFloat(d[attribute]); })-1,
	               d3.max(data, function(d) { return parseFloat(d[attribute]); })+1])
	          .range([1/3*h-10,margin-10]); 
	        return yScale;
	   	}

   		if (i==1){
		  	yScale = d3.scale.linear()
	          .domain([d3.min(data, function(d) { return parseFloat(d[attribute]); })-1,
	               d3.max(data, function(d) { return parseFloat(d[attribute]); })+1])
	          .range([2/3*h-10,1/3*h+margin-10]); 
	        return yScale;
   		}

   		if (i==2){
		  	yScale = d3.scale.linear()
	          .domain([d3.min(data, function(d) { return parseFloat(d[attribute]); })-1,
	               d3.max(data, function(d) { return parseFloat(d[attribute]); })+1])
	          .range([h-10,2/3*h+margin-10]); 
	        return yScale;
   		}
	    
    }  

	     //let's actually create our lines now by calling above function! part 2
	     d3.selectAll('path')
	     	.data(csvData)
	     	.enter().append('path')
	     	.attr('class', function(d) {return 'n'+d.Institution_Name.replace(" ","");})
	     	.each(plotLines)



	// let's plot our yaxis! 
	//Creates as many axis as csv data columns by calling function
    for (var i = categoryStart; i <= attributes.length - 1; i++) {
	   // console.log(attributes[i]);
	   // console.log(maxPoints[i-3]);
	   if (i == categoryStart || i==10 || i==16) {
	   	xCoord = xmargin;
	   }
	   if (i<=9){
		 xCoord +=axisSpacing;
	   plotAxis(attributes[i],xCoord,0,maxPoints[i-categoryStart]); // we pass in attribute name and x coord. of axis
			}

   		if (i>9 && i<=15){
		  	xCoord +=axisSpacing;
	   plotAxis(attributes[i],xCoord,1,maxPoints[i-categoryStart]); // we pass in attribute name and x coord. of axis
			}

   		if (i>15 && i<=21){
   			xCoord +=axisSpacing;
	   plotAxis(attributes[i],xCoord,2,maxPoints[i-categoryStart]); // we pass in attribute name and x coord. of axis
			}
   		}

	 // function that creates axis 
     // input: attribute, xcoordinate of axis
     function plotAxis(attribute, xcoord,axisGroup, maxPoints){
     	//yAxis function
	    var yAxis = d3.svg.axis()
	        .scale(yScaleFunction(attribute,axisGroup))
	        .orient("left")
	        .ticks(5);  //Set rough # of ticks

	     // i call y axis function   
	      svg.append("g")
	        .attr("class", "axis")
	        .attr("transform", "translate(" + 1*xcoord + ",0)")
	        .call(yAxis);

	      // i add some text with locations matching axis
	      yLabel = svg.append('text')
	        .attr('class','label')
	        .attr('x', xcoord )
	        .attr('y', axisGroup/3*h +margin -15)
	        .text(attribute+ " " + " ("+maxPoints+")" );
    		
    		// add rectangles that represent room for improvement
			svg.append("rect")

                .attr('x',xCoord-12.5)
				.attr('y',(axisGroup)/3*h +60 )
                .attr("width", 25)
                .attr("height", 25)
                .style('fill', color2(zScale(room4Improvement[attribute])));


	        }

	// function that creates lines from csv data. 
	//Input: csv data, row number (which can be mapped to flight id)
	function plotLines(d){
		   college = d.Institution_Name;
		   color1 = ''; // empty string that will be used to determine color for Carleton College
		   if(college == 'Carleton College' || 
		   	  college == 'Middlebury College' ||
		   	  college == 'Oberlin College' ||
		   	  college == 'Pomona College' ||
		   	  college == 'Colorado College' ||
		   	  college == 'Macalester College' ||
		   	  college == 'Williams College'
		   	  ){
		   //iterate through number of dimensions
		   		   for (var i = categoryStart; i <= attributes.length - 1; i++) {
		   			  if (i==categoryStart || i==10 || i==16) {
		   			   	xCoord = xmargin;
		   			   }
		   			   if (i<=8){
		   				 xCoord +=axisSpacing;
		   			   appendLine(d,xCoord,i,0);
		   					}
		   
		   		   		if (i>9 && i<15){
		   				  	xCoord +=axisSpacing;
		   			   appendLine(d,xCoord,i,1);
		   					}
		   
		   		   		if (i>15 && i<=20){
		   		   			xCoord +=axisSpacing;
		   			   appendLine(d,xCoord,i,2);
		   					}

		   				//now we also build array of available points for carleton to earn
		   				if(college == 'Carleton College'){
		   					room4Improvement[attributes[i]]= (maxPoints[i-3]-d[attributes[i]]);
		   				}
		   			}
				   	svg.append('text')
			          .attr('class','l'+d.Institution_Name.replace(" ",""))
			          .attr("x", legendX+25)
			          .attr("y", legendY+15)
			          .text(d.SC_Ranking+' '+d.Institution_Name);
			          

					//determines the fill of the circle in the legend
					if(college != 'Carleton College'){
						color1 = color(d.SC_Ranking)
					}
	
					else {
						color1 = '#ffe100'
					}
					svg.append('svg:circle')
						.attr('class', 'point')
						.attr('r',8)
						.attr('cx', legendX+10)
						.attr('cy', legendY+15-4)
						.style('fill', color1);
						legendY += 50;
		   		}
	}

	// function appends lines to svg. Input is data element, coordinate of line
	// input is also id of axis and axis group (top group, middle group, bottom group)
	function appendLine(d,xCoord, i, axisGroup){
			svg.append("line")
			   		.datum(d)
			   		.attr('class', 'n'+d.Institution_Name.replace(" ","")) // make class institution's name
					.attr("x1", xCoord) //start x coord of line
					.attr("y1", yScaleFunction(attributes[i],axisGroup)(d[attributes[i]]),d)//start y coord
					.attr("x2", xCoord+axisSpacing)//end x coord of line
					.attr("y2", yScaleFunction(attributes[i+1],axisGroup)(d[attributes[i+1]]))//end y coord
					.attr("stroke-width", 3)
					.attr("stroke", function(d){if (d.Institution_Name!="Carleton College"){
						return color(d.SC_Ranking);}
						
						else{
							return "#ffe100";
						}
					})
				}
});