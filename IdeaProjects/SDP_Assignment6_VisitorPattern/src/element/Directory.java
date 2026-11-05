package element;

import visitor.Visitor;
import java.util.ArrayList;
import java.util.List;

public final class Directory implements FileSystemElement {
    private final String name;
    private final List<FileSystemElement> children = new ArrayList<>();

    public Directory(String name) {
        this.name = name;
    }

    public void addElement(FileSystemElement element) {
        children.add(element);
    }

    @Override
    public String getName() {
        return name;
    }

    public List<FileSystemElement> getChildren() {
        return List.copyOf(children); // Clean Code Ch. 13: Use Copies of Data
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visitDirectory(this); // Double-dispatch step
    }
}