# Extract lifespan information from Amazon reviews

## Data source
Reviews on electrical equipments

Using data from Julian McAuley, UCSD, downloadable [here](http://jmcauley.ucsd.edu/data/amazon/)

## Method
For now, we only have a very simple, keyword-based method implemented, looking for reviews of the form "worked for X period"

The algorithm is as follows:

For each review,
1. Extract review text
2. Search for "worked for" in the text
3. Search for these time period-defining words in the following 10 words:
..* Day
..* Week
..* Month
..* Year
4. Extract word before the time-period to get the length of time period
5. Convert lifespan to months
