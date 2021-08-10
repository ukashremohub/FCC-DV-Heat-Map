const tooltip = document.getElementById('tooltip');

const colors = ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

fetch('https://gist.githubusercontent.com/ukashremohub/765bada766c83d0ccde757e77640fd89/raw/402b27618d7118d3527b2144f34ca164f11ed614/Global_Temperature.json').
then(res => res.json()).
then(res => {
  const { baseTemperature, monthlyVariance } = res;

  createStuff(monthlyVariance.map(d => ({
    ...d,
    temp: baseTemperature - d.variance })));

});

function createStuff(data) {
  const width = 800;
  const height = 400;
  const padding = 60;

  const cellHeight = (height - 2 * padding) / 12;
  const cellWidth = width / Math.floor(data.length / 12);

  // console.log(data);

  const yScale = d3.scaleLinear().
  domain([0, 11]).
  range([padding, height - padding]);

  const xScale = d3.scaleTime().
  domain([
  d3.min(data, d => d.year),
  d3.max(data, d => d.year)]).

  range([padding, width - padding]);

  const tempScale = d3.scaleLinear().
  domain([
  d3.min(data, d => d.temp),
  d3.max(data, d => d.temp)]).

  range([0, 10]);

  const svg = d3.select('#container').append('svg').
  attr('width', width).
  attr('height', height);

  svg.selectAll('rect').
  data(data).
  enter().
  append('rect').
  attr('class', 'cell').
  attr('data-month', d => d.month - 1).
  attr('data-year', d => d.year).
  attr('data-temp', d => d.temp).
  attr('fill', d => colors[Math.floor(tempScale(d.temp))]).
  attr('x', d => xScale(d.year)).
  attr('y', d => yScale(d.month - 1) - cellHeight).
  attr('width', cellWidth).
  attr('height', cellHeight).
  on('mouseover', (d, i) => {
    tooltip.classList.add('show');
    tooltip.style.left = xScale(d.year) - 60 + 'px';
    tooltip.style.top = yScale(d.month - 1) - 60 + 'px';
    tooltip.setAttribute('data-year', d.year);

    tooltip.innerHTML = `
        <p>${d.year} - ${months[d.month - 1]}</p>
        <p>${d.temp}℃</p>
      `;
  }).on('mouseout', () => {
    tooltip.classList.remove('show');
  });

  // create axis
  const xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).
  tickFormat(month => {
    const date = new Date(0);
    date.setUTCMonth(month);
    return d3.timeFormat('%B')(date);
  });

  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', `translate(0, ${height - padding})`).
  call(xAxis);

  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', `translate(${padding}, ${-cellHeight})`).
  call(yAxis);

  // create the legend
  const legendWidth = 200;
  const legendHeight = 25;

  const legendRectWidth = legendWidth / colors.length;
  const legend = d3.select('body').
  append('svg').
  attr('id', 'legend').
  attr('width', legendWidth).
  attr('height', legendHeight).
  selectAll('rect').
  data(colors).
  enter().
  append('rect').
  attr('x', (_, i) => i * legendRectWidth).
  attr('y', 0).
  attr('width', legendRectWidth).
  attr('height', legendHeight).
  attr('fill', c => c);

}