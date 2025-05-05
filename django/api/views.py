from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Artist, Agent, Organizer, Location, Concert
from .serializers import ArtistSerializer, AgentSerializer, OrganizerSerializer, LocationSerializer, ConcertSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

class ConcertsPerLocationView(APIView):
    def get(self, request):
        start_date = request.query_params.get("start_date") or None
        end_date = request.query_params.get("end_date") or None

        with connection.cursor() as cursor:
            cursor.callproc("GetConcertsPerLocation", [start_date, end_date])
            results = cursor.fetchall()

        return Response([
            {
                "artist_name": row[0],
                "concert_count": row[1],
                "avg_duration_minutes": row[2]
            }
            for row in results
        ])

class ConcertsPerOrganizerView(APIView):
    def get(self, request):
        start_date = request.query_params.get("start_date") or None
        end_date = request.query_params.get("end_date") or None

        with connection.cursor() as cursor:
            cursor.callproc("GetConcertsPerOrganizer", [start_date, end_date])
            results = cursor.fetchall()

        return Response([
            {
                "artist_name": row[0],
                "concert_count": row[1],
                "avg_duration_minutes": row[2]
            }
            for row in results
        ])

class ConcertsPerArtistView(APIView):
    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        with connection.cursor() as cursor:
            cursor.callproc("GetConcertsPerArtist", [start_date, end_date])
            results = cursor.fetchall()
        return Response([
            {
                "artist_name": row[0],
                "concert_count": row[1],
                "avg_duration_minutes": row[2]
            }
            for row in results
        ])

class ConcertsByFiltersView(APIView):
    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        artist_id = request.query_params.get("artist_id")
        organizer_id = request.query_params.get("organizer_id")
        location_id = request.query_params.get("location_id")

        params = [
            start_date or None,
            end_date or None,
            artist_id or None,
            organizer_id or None,
            location_id or None,
        ]

        with connection.cursor() as cursor:
            cursor.callproc("GetConcertsByFilters", params)
            results = cursor.fetchall()

        data = [
            {
                "concert_id": row[0],
                "concert_date": row[1],
                "concert_time": str(row[2]),
                "duration_minutes": row[3],
                "artist_name": row[4],
                "agent_name": row[5],
                "organizer_name": row[6],
                "location_name": row[7],
            }
            for row in results
        ]
        return Response(data)

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer

class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

class OrganizerViewSet(viewsets.ModelViewSet):
    queryset = Organizer.objects.all()
    serializer_class = OrganizerSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class ConcertViewSet(viewsets.ModelViewSet):
    queryset = Concert.objects.all()
    serializer_class = ConcertSerializer

    # Takes special care to silently ignore duplicate entries
    def create(self, request, *args, **kwargs):
        artist = request.data.get('artist')
        concert_date = request.data.get('concert_date')
        concert_time = request.data.get('concert_time')

        # Checks if the concert already exists on the parameters above, and if so, ignores it
        existing = Concert.objects.filter(
            artist=artist,
            concert_date=concert_date,
            concert_time=concert_time
        ).first()

        if existing:
            return Response(
                {"detail": "Duplicate concert ignored."},
                status=status.HTTP_200_OK
            )

        # Creates the concert if it does not already exist
        return super().create(request, *args, **kwargs)