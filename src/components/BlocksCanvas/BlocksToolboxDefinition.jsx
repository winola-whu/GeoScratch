//Helper file for toolbox definition

export const TOOLBOX_XML = `
    <xml id="toolbox" style="display: none">
        <category name="Geometric Objects" categorystyle="math_category">
            <block type="geo_point"></block>
            <block type="geo_vector"></block>
            <block type="parametric_plane"></block>
            <block type="geo_plane"></block>
        </category>
        <category name="Linear Algebra Primitives" categorystyle="text_category">
            <block type="linalg_vec3"></block>
            <block type="linalg_vec4"></block>
            <block type="linalg_mat3x3"></block>
            <block type="linalg_mat4x4"></block>
        </category>
        <category name="Linear Algebra Operators" categorystyle="logic_category">
            <block type="dot_product"></block>
            <block type="cross_product_inplace"></block>
            <block type="multiply_inplace"></block>
            <block type="inverse_inplace"></block>
            <block type="determinant"></block>
            <block type="norm_inplace"></block>
        </category>
        <category name="Variables" custom="VARIABLE" colour=330>
        </category>
        <category name="Measurements" categorystyle="list_category">
            <block type="debug"></block>
        </category>
    </xml>
    `