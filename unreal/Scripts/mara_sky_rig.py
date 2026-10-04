"""
MARA: builds the sky/lighting rig from docs/mara-gdd/03-lighting-time-of-day.md
in the currently open level, and applies a time-of-day preset.

Run inside the Unreal Editor (Python Editor Script Plugin enabled):
    Tools > Execute Python Script...  -> pick this file
or from the Output Log "Python" console:
    import mara_sky_rig; mara_sky_rig.build("golden")
An Unreal MCP server that can execute Python can run build() the same way.

Presets: "golden", "midday", "night_full_moon", "night_new_moon"
Values are starting points; tune them against the look-dev shots in doc 06 §6.4.
Assumes Project Settings > Rendering > "Extend default luminance range in Auto Exposure" is ON,
so auto-exposure min/max are EV100 values.
"""
import unreal

TAG = "MaraSkyRig"

PRESETS = {
    # sun_pitch = -elevation (degrees). Sun intensity is top-of-atmosphere lux; SkyAtmosphere attenuates it.
    "golden": dict(sun_pitch=-4.0, sun_lux=120000.0, sun_vol_scatter=4.0, moon_lux=0.0,
                   mie_scale=0.012, mie_aniso=0.85, mie_exp_km=1.8, aerial_scale=2.0,
                   fog_density=0.02, fog_falloff=0.35, fog_scatter_dist=0.75,
                   fog_albedo=(1.0, 0.86, 0.70), ev_min=9.0, ev_max=12.0,
                   saturation=1.08, white_temp=6000.0, grain=0.0),
    "midday": dict(sun_pitch=-75.0, sun_lux=120000.0, sun_vol_scatter=0.4, moon_lux=0.0,
                   mie_scale=0.006, mie_aniso=0.75, mie_exp_km=1.2, aerial_scale=1.5,
                   fog_density=0.004, fog_falloff=0.2, fog_scatter_dist=0.6,
                   fog_albedo=(1.0, 0.95, 0.9), ev_min=14.0, ev_max=15.5,
                   saturation=0.92, white_temp=6700.0, grain=0.0),
    "night_full_moon": dict(sun_pitch=40.0, sun_lux=0.0, sun_vol_scatter=0.0, moon_lux=0.25, moon_pitch=-50.0,
                   mie_scale=0.004, mie_aniso=0.8, mie_exp_km=1.2, aerial_scale=1.0,
                   fog_density=0.01, fog_falloff=0.3, fog_scatter_dist=0.6,
                   fog_albedo=(0.9, 0.92, 1.0), ev_min=-2.0, ev_max=-1.0,
                   saturation=0.3, white_temp=4500.0, grain=0.2),
    "night_new_moon": dict(sun_pitch=40.0, sun_lux=0.0, sun_vol_scatter=0.0, moon_lux=0.0, moon_pitch=-50.0,
                   mie_scale=0.004, mie_aniso=0.8, mie_exp_km=1.2, aerial_scale=1.0,
                   fog_density=0.01, fog_falloff=0.3, fog_scatter_dist=0.6,
                   fog_albedo=(0.9, 0.92, 1.0), ev_min=-3.5, ev_max=-3.0,
                   saturation=0.1, white_temp=4300.0, grain=0.25),
}


def _actors():
    return unreal.get_editor_subsystem(unreal.EditorActorSubsystem)


def _find_or_spawn(cls, label):
    for a in _actors().get_all_level_actors():
        if a.get_actor_label() == label:
            return a
    a = _actors().spawn_actor_from_class(cls, unreal.Vector(0, 0, 0), unreal.Rotator(0, 0, 0))
    a.set_actor_label(label)
    a.tags = [TAG]
    a.set_folder_path(TAG)
    return a


def _set(obj, prop, value):
    try:
        obj.set_editor_property(prop, value)
    except Exception as e:  # property names drift between engine versions; keep going
        unreal.log_warning(f"[Mara] could not set {obj.get_class().get_name()}.{prop}: {e}")


def build(preset="golden"):
    p = PRESETS[preset]

    sun = _find_or_spawn(unreal.DirectionalLight, "Mara_Sun")
    moon = _find_or_spawn(unreal.DirectionalLight, "Mara_Moon")
    sky = _find_or_spawn(unreal.SkyAtmosphere, "Mara_SkyAtmosphere")
    skylight = _find_or_spawn(unreal.SkyLight, "Mara_SkyLight")
    fog = _find_or_spawn(unreal.ExponentialHeightFog, "Mara_HeightFog")
    clouds = _find_or_spawn(unreal.VolumetricCloud, "Mara_VolumetricCloud")
    ppv = _find_or_spawn(unreal.PostProcessVolume, "Mara_PostProcess")

    # Sun / Moon (doc 03 §3.1)
    for actor, index, angle in ((sun, 0, 0.5357), (moon, 1, 0.5)):
        lc = actor.get_component_by_class(unreal.DirectionalLightComponent)
        _set(lc, "mobility", unreal.ComponentMobility.MOVABLE)
        _set(lc, "atmosphere_sun_light_index", index)
        _set(lc, "light_source_angle", angle)
        _set(lc, "cast_cloud_shadows", True)
    sun_lc = sun.get_component_by_class(unreal.DirectionalLightComponent)
    _set(sun_lc, "intensity", p["sun_lux"])
    _set(sun_lc, "volumetric_scattering_intensity", p["sun_vol_scatter"])
    sun.set_actor_rotation(unreal.Rotator(roll=0.0, pitch=p["sun_pitch"], yaw=-75.0), False)
    moon_lc = moon.get_component_by_class(unreal.DirectionalLightComponent)
    _set(moon_lc, "intensity", p["moon_lux"])
    _set(moon_lc, "temperature", 4100.0)
    _set(moon_lc, "use_temperature", True)
    moon.set_actor_rotation(unreal.Rotator(roll=0.0, pitch=p.get("moon_pitch", 30.0), yaw=110.0), False)

    # Sky Atmosphere (doc 03 §3.2.2 / §3.3.2). Note: UE's property really is spelled "pespective".
    sa = sky.get_component_by_class(unreal.SkyAtmosphereComponent)
    _set(sa, "mie_scattering_scale", p["mie_scale"])
    _set(sa, "mie_anisotropy", p["mie_aniso"])
    _set(sa, "mie_exponential_distribution", p["mie_exp_km"])
    _set(sa, "aerial_pespective_view_distance_scale", p["aerial_scale"])

    # Sky Light: real-time capture, solid red-loam lower hemisphere
    sl = skylight.get_component_by_class(unreal.SkyLightComponent)
    _set(sl, "mobility", unreal.ComponentMobility.MOVABLE)
    _set(sl, "real_time_capture", True)
    _set(sl, "lower_hemisphere_is_black", True)
    _set(sl, "lower_hemisphere_color", unreal.LinearColor(0.10, 0.04, 0.02, 1.0))

    # Height fog with volumetric fog
    fc = fog.get_component_by_class(unreal.ExponentialHeightFogComponent)
    _set(fc, "fog_density", p["fog_density"])
    _set(fc, "fog_height_falloff", p["fog_falloff"])
    _set(fc, "volumetric_fog", True)
    _set(fc, "volumetric_fog_scattering_distribution", p["fog_scatter_dist"])
    r, g, b = p["fog_albedo"]
    _set(fc, "volumetric_fog_albedo", unreal.Color(int(r * 255), int(g * 255), int(b * 255), 255))

    # Post process: unbound, physical exposure range, grading
    _set(ppv, "unbound", True)
    s = ppv.get_editor_property("settings")
    for prop, val in (
        ("auto_exposure_min_brightness", p["ev_min"]),
        ("auto_exposure_max_brightness", p["ev_max"]),
        ("white_temp", p["white_temp"]),
        ("film_grain_intensity", p["grain"]),
        ("color_saturation", unreal.Vector4(p["saturation"], p["saturation"], p["saturation"], 1.0)),
    ):
        _set(s, prop, val)
        _set(s, "override_" + prop, True)
    _set(ppv, "settings", s)

    unreal.log(f"[Mara] sky rig built with preset '{preset}' ({len(PRESETS)} presets available)")


if __name__ == "__main__":
    build("golden")
