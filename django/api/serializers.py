from rest_framework import serializers
from .models import Artist, Agent, Organizer, Location, Concert

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        # fields = ['id', 'agent_first_name', 'agent_last_name', 'agent_email', 'agent_phone']
        fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
    agent = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(),
        required=False,
        allow_null=True,
        write_only=True # For POST, you only need the agent_id
    )
    agent_info = AgentSerializer(source='agent', read_only=True) # Full agent information will only show up for GET

    class Meta:
        model = Artist
        fields = [
            'id',
            'artist_first_name',
            'artist_last_name',
            'primary_genre',
            'artist_email',
            'artist_phone',
            'agent',        # for POST
            'agent_info'    # for GET
        ]

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizer
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ConcertSerializer(serializers.ModelSerializer):
    artist_name = serializers.SerializerMethodField()
    agent_name = serializers.SerializerMethodField()
    organizer_name = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()

    class Meta:
        model = Concert
        fields = [
            'id',
            'artist', 'organizer', 'location',
            'concert_date', 'concert_time', 'duration_minutes',
            'artist_name', 'agent_name', 'organizer_name', 'location_name',
        ]

    def get_artist_name(self, obj):
        return f"{obj.artist.artist_first_name} {obj.artist.artist_last_name}"

    def get_agent_name(self, obj):
        agent = obj.artist.agent
        return f"{agent.agent_first_name} {agent.agent_last_name}" if agent else "—"

    def get_organizer_name(self, obj):
        return f"{obj.organizer.organizer_first_name} {obj.organizer.organizer_last_name}"

    def get_location_name(self, obj):
        return f"{obj.location.city}, {obj.location.country}"

