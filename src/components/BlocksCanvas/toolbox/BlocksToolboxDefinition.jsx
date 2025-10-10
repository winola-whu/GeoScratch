const TOOLBOX_XML = `
    <xml id="toolbox" style="display: none">
        <category name="Geometric Objects" categorystyle="math_category">
            <block type="geo_point"></block>
            <block type="geo_vector"></block>
            <block type="parametric_plane"></block>
<!--            <block type="geo_plane"></block>-->
            <block type="geo_cube"></block>
            <block type="geo_sphere"></block>
        </category>
        <category name="Linear Algebra Primitives" categorystyle="text_category">
            <block type="linalg_vec3"></block>
<!--            <block type="linalg_vec4"></block>-->
<!--            <block type="linalg_mat3x3"></block>-->
<!--            <block type="linalg_mat4x4"></block>-->
            <block type="scalar"></block>
            <block type="rot_matrix"></block>
            <block type="trans_matrix"></block>
            <block type="scale_matrix"></block>            
        </category>
        <category name="Linear Algebra Operators" categorystyle="logic_category">
            <block type="object_transform"></block>
<!--            <block type="vector_transform"></block>      -->
            <block type="vector_arithmetic"></block>
            <block type="vector_cross_product"></block>
            <block type="vector_normalise"></block>
            <block type="vector_project"></block>
            <block type="vector_magnitude"></block>
<!--            <block type="multiply_inplace"></block>-->
<!--            <block type="inverse_inplace"></block>-->
<!--            <block type="determinant"></block>-->
<!--            <block type="dot_product"></block>            -->
        </category>
        <category name="Measurements" categorystyle="list_category">
            <block type="debug"></block>
        </category>
    </xml>
    `

export default TOOLBOX_XML

{/* <category name="Geometric Object Variables" custom="OBJS_3D" colour=140>
    <button text="Create 3D Object..." callbackKey="createObj3DButtonCallback"></button>
    <block type="variables_get_obj3D"></block>
    <block type="variables_set_obj3D"></block>
</category> */}

{/* <category name="Variables" custom="VARIABLE" colour=330>
</category> */}