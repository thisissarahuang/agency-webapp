from django.db import models

# Schema (NN means not null):
# Agents(agent_id (PK), agent_first_name (NN), agent_last_name (NN), agent_email (UK), agent_phone) 
# Artists(artist_id (PK), artist_first_name (NN), artist_last_name (NN), primary_genre, artist_email (UK), artist_phone, agent_id (FK))
# Organizers(organizer_id (PK), organizer_first_name (NN), organizer_last_name (NN), organizer_email (UK), organizer_phone, company)
# Locations(location_id (PK), address (NN), city (NN), state, country (NN))
# Concerts(concert_id (PK), artist_id (FK), location_id (FK), organizer_id (FK), concert_date (NN), concert_time (NN), duration_minutes (NN))

# These classes all default to having a UUID as their primary key, recommended by ORM
class Agent(models.Model):
    agent_first_name = models.CharField(max_length=100)
    agent_last_name = models.CharField(max_length=100)
    agent_email = models.EmailField(unique=True)
    agent_phone = models.CharField(max_length=20, blank=True)

class Artist(models.Model):
    artist_first_name = models.CharField(max_length=100)
    artist_last_name = models.CharField(max_length=100)
    primary_genre = models.CharField(max_length=100, blank=True)
    artist_email = models.EmailField(unique=True)
    artist_phone = models.CharField(max_length=20, blank=True)
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name='artists')

class Organizer(models.Model):
    organizer_first_name = models.CharField(max_length=100)
    organizer_last_name = models.CharField(max_length=100)
    organizer_email = models.EmailField(unique=True)
    organizer_phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)

class Location(models.Model):
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100)

class Concert(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='concerts') # related_name allows artist.concert_set.all() to instead be artist.concerts.all()
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    organizer = models.ForeignKey(Organizer, on_delete=models.CASCADE)
    concert_date = models.DateField()
    concert_time = models.TimeField()
    duration_minutes = models.IntegerField(default=60)  # or null=True if optional

    # An artist cannot have another concert at the same time - prevents duplicates
    class Meta:
        unique_together = ('artist', 'concert_date', 'concert_time')
