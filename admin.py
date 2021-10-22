from django.contrib import admin

from .models import  Email

class AuthorAdmin(admin.ModelAdmin):
    pass
admin.site.register(Email, AuthorAdmin)
